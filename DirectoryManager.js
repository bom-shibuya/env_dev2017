// *********** DIRECTORY ***********
const DirectoryManager = path => {
  const basePath = path || '';
  return {
    src: basePath + 'app/src/',
    src_assets: basePath + 'app/src/assets/',
    dest: basePath + 'app/dest/',
    dest_assets: basePath + 'app/dest/assets/',
    release: basePath + 'app/_release/',
    release_assets: basePath + 'app/_release/assets/'
  };
};

export default DirectoryManager;
