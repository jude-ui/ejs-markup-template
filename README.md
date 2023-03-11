# boilerplate-ejs
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


ejs 템플릿 엔진을 이용하여 UI 마크업 개발을 위한 보일러플레이트.
상세 내용은 하단 위키 링크 참고 바랍니다.
> 위키 문서: https://wiki.daumkakao.com/pages/viewpage.action?pageId=761810986

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

