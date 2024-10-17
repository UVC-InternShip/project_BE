import { Client } from '@googlemaps/google-maps-services-js';
import { googleMapsApiKey } from '../config/googleMaps.js';

const client = new Client({});

const mapService = {
  async getLocation(params) {
    const response = await client.reverseGeocode({
      params: {
        latlng: {
          lat: parseFloat(params.latitude),
          lng: parseFloat(params.longitude),
        },
        language: 'ko',
        key: googleMapsApiKey,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results;
      const targetTypes = ['political', 'sublocality', 'sublocality_level_2']; // 시/구/동을 가지고 있는 주소 추출하기 위함

      // 추출
      const foundResult = result.find((item) =>
        targetTypes.every((type) => item.types.includes(type))
      );

      // console.log(foundResult.address_components);

      if (foundResult) {
        const addressComponents = foundResult.address_components;

        const extractAddressComponent = (types) => {
          return (
            addressComponents.find((component) =>
              types.some((type) => component.types.includes(type))
            )?.long_name || ''
          );
        };

        // const sido = extractAddressComponent(['administrative_area_level_1']);
        // const sigungu = extractAddressComponent(['sublocality_level_1']);
        // const dong = extractAddressComponent(['sublocality_level_2']);

        return {
          sido: extractAddressComponent(['administrative_area_level_1']),
          sigungu: extractAddressComponent(['sublocality_level_1']) // 구 와 시는 type이 다름 따라서 삼항연산자로 처리
            ? extractAddressComponent(['sublocality_level_1'])
            : extractAddressComponent(['locality']),
          eupmyeondong: extractAddressComponent(['sublocality_level_2']),
          fullAddress: foundResult.formatted_address,
        };
      } else {
        console.log('no matching result');
      }
    }
  },
};

export default mapService;
