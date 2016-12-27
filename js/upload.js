(function(document) {
const dropArea = document.querySelector('.drop-area');
const uploadCt = document.querySelector('.upload-content');
const wrapText = document.querySelectorAll('.wrap p');
const inputFiles = document.querySelectorAll('.chooseFile input');

let fileArray = [];

dropArea.addEventListener('dragenter', dragenter, false);
dropArea.addEventListener('dragover', dragover, false);
dropArea.addEventListener('dragleave', dragleave, false);
dropArea.addEventListener('drop', drop, false);

Array.from(inputFiles).forEach((file) => file.addEventListener('change', selectFiles, false));

function dragenter(e) {
  if (e.target === dropArea) {
    e.target.style.backgroundColor = '#e0f7fa';
    e.target.firstElementChild.style.setProperty('visibility', 'hidden');
  }
}

function dragover(e) {
  e.preventDefault();
}

function dragleave(e) {
  if(e.target === dropArea) {
    e.target.style.backgroundColor = '#FDFEFE';
    e.target.firstElementChild.style.setProperty('visibility', 'visible');
  }
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  dropArea.style.backgroundColor = '#FDFEFE';
  dropArea.firstElementChild.style.setProperty('visibility', 'visible');

  let files = e.dataTransfer.files;

  files = verify(files);
  
  if(files.length !== 0) {
    changeH(files.length);
  
    handleFiles(files);
  }
}


function selectFiles(e) {
  let files = e.target.files;

  if(files.length !== 0) {

    files = verify(files);

    if(files.length !== 0) {
      changeH(files.length);

      handleFiles(files);
    }
  }
}


function changeH(length) {
  let curTop = dropArea.style.getPropertyValue('top');
  if(curTop !== '') {
    curTop = +curTop.slice(0,2);
  } else {
    curTop = 0;
  }

  if (curTop === 80) return;

  const addTop = length * 24 + 8;
  const resTop = addTop + curTop;
  
  if (resTop > 80) {
    dropArea.style.cssText = `top: 80%`;
    Array.from(wrapText).map((i) => i.style.display = 'inline');
  } else {
    dropArea.style.cssText = `top: ${resTop}%`;
  }
}

function handleFiles(files) {
  const length = files.length;
  let fileCt = document.querySelector('.file-ct');

  if (!fileCt) {
    fileCt = document.createElement('ul');
    fileCt.className = 'file-ct';
    uploadCt.insertAdjacentElement('afterbegin', fileCt);
  }
  
  for(let file of files) {
    addFileItem(file.size, file.type, file.name);
  }
}

function verify(files) {
  if(fileArray.length !== 0) {
    let arr = Array.from(files);

     files = arr.filter((f) => {
      for(let file of fileArray) {
        return f.size !== file.size;
      }
     });

     console.log(files);
     console.log(fileArray);
  } 
  if(files.length !== 0 ) {
    //添加file到fileArray数组中
    for(let file of files) {
      fileArray.unshift(file);
    }

  }

  return files;
  
}

function addFileItem(fileSize, fileType, fileName) {
  const size = showSize(fileSize);
  const typeIco = showFileType(fileType);
  const fileCt = document.querySelector('.file-ct');
  const fNameExp = /\.(\w+)/.exec(fileName);
  fileName = fileName.slice(0, fNameExp.index + 1) + fNameExp[1].toLowerCase();

  const fileItem = `<li class="file-item">
    ${typeIco}
    <div class="item-l">
      <p class="file-name">${fileName}</p> 
      <p class="file-size">${size}</p>
    </div>
    <div class="item-r">
      <i class="fa fa-times"></i>
    </div>
  </li>`;


  fileCt.insertAdjacentHTML('afterbegin', fileItem);

}

function showSize(size) {
  const unit = [' KB', ' MB', ' TB'];
  let index = -1;

  if(size < 1024) return size + ' bytes';

  for(; size >= 1024; index++) {
    size = size / 1024;
  }

  return size.toFixed(1) + unit[index];
}

function showFileType(fileType) {
  const type = /\w*\/(\w*)$/.exec(fileType)[1];
  let className = '';

  switch(type) {
    case 'pdf':
      className = 'fa fa-file-pdf-o fa-2x';
      break;
    case 'png':
      className = 'fa fa-file-image-o fa-2x';
      break;
    case 'jpeg':
      className = 'fa fa-file-image-o fa-2x';
      break;
    case 'zip':
      className = 'fa fa-file-archive-o fa-2x';
      break;
    default:
      className = 'fa fa-file fa-2x';
  }

  return `<i class="${className}"></i>`;
}

function removeItem() {
  
}

function removeAll() {
  file = [];
}

function uploadFiles(url) {
  let formData = new FormData();

  for(let file of files) {
    formData.append(file.name, file);
  }

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  xhr.send(formData);
  
  xhr.addEventListener('progress', function(e) {
    if(e.lengthComputable) {
      let total = e.total;
      let loaded = e.loaded;

      let percent = loaded / total;
      
      loaded = showSize(loaded);

    }
  }, false)

  xhr.addEventListener('load', function() {
    console.log('上传成功！');
  }. false)
}

})(document);


