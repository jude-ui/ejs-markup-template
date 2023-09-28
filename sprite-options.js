// 스프라이트 이미지 소스를 넣어놓을 폴더 이름
const spriteFolderName = 'sprites';
exports.spriteDirName = spriteFolderName;

// 스프라이트 이미지 소스를 넣어놓을 폴더 경로
exports._spriteSourcesPath = `src/images/${spriteFolderName}*/*`;

/**
 * spriteRatioOptions
 * 스프라이트 css 구성 방법에 대한 옵션
 * 
 * @basicRatio 1배 이미지만 사용하는 구성 (svg로만 작업된 pc,m 페이지 또는 일반 이미지로 작업된 pc 페이지 대응)
 * @retinaOnly 2배 이미지만 사용하는 구성 (보통 모바일 2배수 대응)
 * @withRetina 1배와 2배 이미지 각각 사용하는 구성 (보통 PC 레티나 대응) (retinaSuffix 값 필수)
 */
exports.spriteRatioOptions = {
  basicRatio: false,
  retinaOnly: 1,
  withRetina: false,
}

// retina 이미지를 구분하는 이미지명의 접미사(suffix)
exports.retinaSuffix = '_2x'; 

// sprite css가 빌드될 폴더 경로
exports.spriteCssOutputPath = '/css'; 

// 모바일 ir 클래스(프로젝트에 따라 변경)
exports.irCss = 'display:block;overflow:hidden;font-size:1px;line-height:0;color:transparent';