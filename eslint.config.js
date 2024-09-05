import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier'; // Prettier 플러그인 추가

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest', // 최신 ECMAScript 버전을 사용하도록 설정
      sourceType: 'module', // 모듈 방식으로 소스코드를 작성할 수 있도록 설정
      globals: {
        ...globals.browser, // 브라우저 환경 전역 변수
        ...globals.node, // Node.js 환경 전역 변수 추가
      },
    },
    plugins: {
      prettier: eslintPluginPrettier, // Prettier 플러그인 추가
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // Prettier에서도 싱글 쿼트를 사용하도록 설정
          endOfLine: 'auto',
        },
      ],
      'linebreak-style': 0, // 라인 브레이크 스타일을 강제하지 않음
      'no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ], // 사용되지 않는 변수를 경고로 처리
    },
  },
  pluginJs.configs.recommended, // ESLint 기본 추천 설정 추가
  prettierConfig, // Prettier 설정 추가 (Prettier와 충돌하는 ESLint 규칙 비활성화)
];
