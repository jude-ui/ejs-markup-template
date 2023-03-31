ejs 템플릿 엔진을 이용하여 UI 마크업 개발을 위한 보일러플레이트 입니다.
- v2.0.0 버전부터 코드 최적화 및 node 및 웹팩 마이그레이션 대응 등을 진행하였습니다.

## How To Use

> 이 프로젝트는 node.js 버전은 14버전 이상, 16.19.1 권장하고 있으며
> npm 버전은 6 이상 설치하는 것을 권장 합니다.


- **NPX 사용시**
    ```
    $ npx degit jude-ui/markup-temp <프로젝트 이름>
    ```

- **모듈 설치**
    ```
    $ npm i
    ```
- **시작**
    ```
    // 개발 서버 시작시
    $ npm start

    // 배포용 빌드시
    $ npm run build

    // 개발 서버 포트가 8080일 경우 index 페이지
    http://localhost:8080/html/page-list.html
    ```

- **프로젝트 루트 경로에 `dev-server-config.js` 파일 생성**
    ```
    // dev-server-config.js

    exports.USE_SOURCE_MAP = true // sass 소스맵 사용 여부 - 기본값 false
    exports.DEV_SERVER_PORT = 8080 // 개발 서버 포트 번호 - 기본값 8080
    exports.DEV_FOLDER = 'dev' // 개발 서버 작동시 바라보는(기준이 되는) 폴더 이름 - 기본값 'dev'
    exports.PROD_FOLDER = 'build' // 빌드시 생성되는 폴더 이름 - 기본값 'build'
    ```
    - **DEV_FOLDER 와 PROD_FOLDER 이름을 바꾸고 싶을 경우**
        1. `dev-server-config.js` 파일의 `DEV_FOLDER` 와 `PROD_FOLDER` 값을 변경
        2. `package.json` 의 `scripts.build`, `script.start` 명령어 쪽에 폴더명 각각 수정
        3. `config.lib.js` 파일의 `cssImageRef` 속성에서 수정

- **자동 스프라이트 기능**
    1. `images` 폴더 하위에 `sprites` 라는 폴더를 만들고 스프라이트 종류별로 하위 폴더 생성하여 이미지들을 추가 (ex. `images/sprites/ico`)
        - 스프라이트 하위 폴더 및 파일이 `images/sprites/ico/qr_code.png`일 경우, 공통 스프라이트 클래스는 `ico_comm`, 스프라이트 css의 셀렉터는 `.ico_qr_code` 로 생성됨
    2. `config.lib.js` 파일에서 설정
        - `spriteRatioOptions` 옵션 : 스프라이트 사용 방법 지정
            - `basicRatio` 1배 이미지만 사용하여 스프라이트를 구성하고 싶을 경우 `true`(retinaSuffix 값 무시됨)
            - `retinaOnly` 2배 이미지만 사용하여 스프라이트를 구성하고 싶을 경우 `true`(retinaSuffix 값 무시됨)
            - `basicRatio` 1배와 2배 이미지 모두 사용하여 스프라이트를 구성하고 싶을 경우 `true`(retinaSuffix 값 필수)
        - `retinaSuffix` 값 :  1배와 2배 이미지를 구분해주기 위한 2배 이미지명 뒤에 붙는 구분 문자를 지정
        - `irCss` 값 : 공통 스프라이트 클래스에 들어가는 css ir 속성 - 프로젝트 환경에 따라 설정

- **자동 스프라이트를 사용 안할 경우**
    1. `config.lib.js` 파일의 `spriteRatioOptions` 객체의 모든 속성을 false로 설정
        ```
        const spriteRatioOptions = {
            basicRatio: false,
            retinaOnly: false,
            withRetina: false,
        }
        ```
    2. `images` 폴더 하위의 `sprites` 폴더를 삭제





## Version Info
```
node: 16.19.1
npm: 8.19.3
webpack 5.75.0
webpack-cli 4.10.0
webpack-dev-server 4.11.1

sass 1.58.3
sass-loader 13.2.0
css-loader 6.7.3
```

## Boilerplate-ejs Update Info
- `v2.2.0 ` 23.04.01 업데이트
    - 코드 최적화
    - 자동 sprite 생성 기능 커스텀 (1배, 2배, 1배 && 2배 각각 옵션 생성)
- `v2.1.0 ` 23.03.12 업데이트
    - depth 구분을 _ 로 하여 한줄로 작성하도록 수정
    - generate-index-html-plugin 리팩토링
    - page-list.ejs 리팩토링
- `v2.0.0 ` 23.03.07 업데이트
    - webpack 업데이트
    - webpack-cli 업데이트
    - webpack-dev-server 업데이트
    - node-sass 제거
    - sass(dart-sass) 설치
    - sass-loader 업데이트
    - css-loader 업데이트
    - webpack.config-dev.js의 devServer 옵션 마이그레이션
- `v1.7.1 ` 21.10.28 업데이트
    - webpack performance 설정
- `v1.7.0 ` 21.09.02 업데이트
    - page-list 페이지 목록 그룹화 기능 개선
- `v1.6.0 ` 21.07.22 업데이트
    - pre-processor를 사용하지 않는 *.css 파일을 사용할 수 있도록 기능 추가
    - 웹팩 번들링 시 css 파일 내에 적용한 주석
- `v1.5.0 ` 21.07.13 업데이트
    - `npm run start` 또는 `npm run build`시 터미널에 페이지 정보 데이터 오류 시 표시 기능
- `v1.4.0 ` 21.06.15 업데이트
    - js 파일을 원본 그대로 output 으로 나오도록 설정
    - production 모드 빌드 시 제외할 ejs 파일 설정
- `v1.3.0 ` 21.06.01 업데이트
    - multi js 파일 빌드
    - index.html: 신규, 수정, 스펙아웃 페이지 구분 위한 클래스 적용
    - index.html: 페이지 목록 그룹화
- `v1.2.0 ` 21.05.18 업데이트
    - index.html 비고에 태그 사용 가능
    - URL 쿼리스트링 대체 방안 예제 (스크립트 미사용)
    - 로컬 서버 도메인 관련 webpack 설정
    - userAgent 관련 공통 기능 제공
    - IE 에서 JS 관련 오류 수정
    - production 모드 빌드 시 html 주석 제거되지 않도록 수정
    - 디버깅 편의를 위한 sourcemap 기능 제공
- `v1.1.2 ` ie es6 오류 대응 (index.html): 백틱 및 arrow function 제거
- `v1.1.1 ` vdi 환경에서 jquery cdn 로드 불가 이슈 해결 (내부 cdn 사용)
- `v1.1.0 `
    - css outputStyle 'compact' 일 때 빈 줄 및 공백 제거
    - css outputStyle 'compressed' 일 때 @charset 추가
- `v1.0.23 `
    - css 빌드 시 모드별 output 스타일 설정 (default: compact)
    - 다크모드 대응 관련 수정
    - build multi css files
- `v1.0.22 ` 다운로드한 dist 내 index.html 에서 URL 표시
- `v1.0.21 ` js 미사용시 대응 설정
- `v1.0.20 ` index.html 자동생성: 페이지 정보 데이터 없는 템플릿파일 표시 기능
- `v1.0.19 ` 포트 설정 파일 별도 분리 .gitignore 등록