(function(document) {
const dropArea = document.querySelector('.drop-area');
const uploadCt = document.querySelector('.upload-content');
const wrapText = document.querySelectorAll('.wrap p');
const inputFiles = document.querySelectorAll('.chooseLabel input');
const removeBtn = document.querySelector('.discard');
const uploadBtn = document.querySelector('.upload-button');

let fileArray = [];
let isEmpty = true;

dropArea.addEventListener('dragenter', dragenter, false);
dropArea.addEventListener('dragover', dragover, false);
dropArea.addEventListener('dragleave', dragleave, false);
dropArea.addEventListener('drop', drop, false);

Array.from(inputFiles).forEach((file) => file.addEventListener('change', selectFiles, false));

removeBtn.addEventListener('click', removeAll, false);

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
    changeH();
    
    toggleBtn(true);

    handleFiles(files);
  }
}


function selectFiles(e) {
  let files = e.target.files;

  if(files.length !== 0) {

    files = verify(files);

    if(files.length !== 0) {
      changeH();

      toggleBtn(true);

      handleFiles(files);
    }
  }
}


function changeH() {
  const num = fileArray.length;
  
  switch(num) {
    case 0:
      dropArea.style.top = '0px';
      wrapText.forEach((i) => i.style.display = 'block');
      break;
    case 1:
      dropArea.style.top = '32%';
      break;
    case 2:
      dropArea.style.top = '56%';
      wrapText.forEach((i) => i.style.display = 'block');
      break;
    default:
      dropArea.style.top = '80%';
      wrapText.forEach((i) => i.style.display = 'inline');
  }
}

function toggleBtn(bool) {
  if(bool && isEmpty) {
    isEmpty = false;
    removeBtn.classList.add('discard-active');
    removeBtn.removeAttribute('disabled');

    uploadBtn.firstChild.nodeValue = 'Upload';
    uploadBtn.firstElementChild.removeEventListener('change', selectFiles, false);
    uploadBtn.firstElementChild.remove();
    uploadBtn.addEventListener('click', uploadFiles, false);
    uploadBtn.lastElementChild.className = 'fa fa-upload';
  
  } 
  if(!bool && !isEmpty) {
    isEmpty = true;
    removeBtn.classList.remove('discard-active');
    removeBtn.setAttribute('disabled', 'disabled');
    uploadBtn.removeEventListener('click', uploadFiles, false);

    uploadBtn.firstChild.nodeValue = 'Attach files';
    const chooseFile = `<input id="attachFile" type="file" multiple> `;
    uploadBtn.lastElementChild.insertAdjacentHTML('beforebegin', chooseFile);
    uploadBtn.firstElementChild.addEventListener('change', selectFiles, false);
    uploadBtn.lastElementChild.className = 'fa fa-paperclip fa-flip-horizontal';
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
  
  fileCt.addEventListener('click', removeItem, false);

  for(let file of files) {
    addFileItem(file.size, file.type, file.name);
  }

}

function verify(files) {
  if(fileArray.length !== 0) {
    files = Array.from(files);
    for(let i = 0; i < files.length; i++) {
      let noExsit = fileArray.every((f) => {
        return f.size !== files[i].size;
      })
      if(!noExsit) files.splice(i, 1);
    };
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
  const fNameExp = /\.(\w+?)$/.exec(fileName);
  fileName = fileName.slice(0, fNameExp.index + 1) + fNameExp[1].toLowerCase();

  const fileItem = `<li class="file-item" data-id=${fileSize}>
    ${typeIco}
    <div class="item-l">
      <p class="file-name">${fileName}</p>
      <progress value="0" max="100"></progress> 
      <p class="file-size">${size}</p>
    </div>
    <div class="item-r">
      <s class="fa fa-times"></s>
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

function removeItem(e) {

  if(e.target.tagName === 'S') {
    let item = e.target.parentNode.parentNode;
    let index = 0;

    fileArray.forEach(function (file, i) {
      if(file.size === item.dataset.id) {
        index = i;
      }
    })

    fileArray.splice(index, 1);

    if(fileArray.length == 0) {
      toggleBtn(false);
    }

    item.remove();

    changeH();
  }
}

function removeAll() {
  if(confirm('确认删除所有上传队列？')) {
    let fileCt = document.querySelector('.file-ct');

    fileCt.parentNode.removeChild(fileCt);

    fileArray = [];
    
    changeH();

    toggleBtn(false);
  }
}

function uploadFiles() {
  let formData = new FormData();
  let totalSize = [];
  let num = 0;

  for(let i = 0; i< fileArray.length; i++) {
    let file = fileArray[i];
    formData.append(file.name, file);
    totalSize[i] = file.size; 
  }

  let xhr = new XMLHttpRequest();
  xhr.open('POST', null, true);
  
  xhr.addEventListener('progress', function(e) {
    if(e.lengthComputable) {
      let total = e.total;
      let loaded = e.loaded;

      let percent = loaded / totalSize[num];
      
      loaded = showSize(loaded);

      if(loaded > totalSize[num]) {
        fileCt.children[num].attachEvent('click', removeItem);
        num++;
      }
    }
  }, false)

  xhr.addEventListener('load', function() {
    if(xhr.status === 200) {
      alert('上传成功！');
    } else {
      alert('上传失败！');
    }
  }, false)


  xhr.send(formData);
}

})(document);


