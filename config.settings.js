exports.DEV_FOLDER = 'dev' // 개발 서버 작동시 바라보는(기준이 되는) 폴더 이름
exports.PROD_FOLDER = 'build' // 빌드시 생성되는 폴더 이름
exports.USE_SOURCE_MAP = 'eval-cheap-module-source-map'; // scss 소스맵 사용 여부 (미사용시 false), (https://webpack.kr/configuration/devtool/)
exports.DEV_SERVER_PORT = 8080 // 개발 서버 포트 번호
exports.CONFIG_JS_ENTRY = false // js 모듈 방식 사용 유무
exports.IS_JS_MINIFY = false // 빌드시 js 압축 유무
exports.CSS_OUTPUT_STYLE = 'expanded' // 개발, 빌드시 css 출력 방식 설정 ('compressed', 'expanded' 둘 중 하나로 설정 *compressed로 설정할시 언어셋 설정 및 모든 주석 사라짐)