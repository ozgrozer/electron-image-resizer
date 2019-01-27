const os = window.require('os')
const path = window.require('path')
const sharp = window.require('electron-sharp')
const Store = window.require('electron-store-data')

const storeSettings = new Store({
  path: 'settings',
  defaults: {
    outputSettings: {
      width: '320',
      height: '240',
      outputFolder: path.join(os.homedir(), 'Desktop', '/')
    }
  }
})

const gearSelector = document.getElementById('gear')
const dropHereViewSelector = document.getElementById('dropHereView')
const settingsViewSelector = document.getElementById('settingsView')
const selectFilesInputSelector = document.getElementById('selectFilesInput')

const settingsFormSelector = document.getElementById('settingsForm')
const widthInputSelector = document.getElementById('widthInput')
const heightInputSelector = document.getElementById('heightInput')
const outputFolderInputSelector = document.getElementById('outputFolderInput')
const saveButtonSelector = document.getElementById('saveButton')

widthInputSelector.value = storeSettings.data.outputSettings.width
heightInputSelector.value = storeSettings.data.outputSettings.height
outputFolderInputSelector.value = storeSettings.data.outputSettings.outputFolder

const resizeImages = (opts) => {
  const files = []
  Object.keys(opts.files).map((key) => {
    const file = opts.files[key]
    files[key] = {
      name: file.name,
      path: file.path
    }
  })
  const totalFiles = Object.keys(files).length

  const settings = {
    width: parseInt(storeSettings.data.outputSettings.width),
    height: parseInt(storeSettings.data.outputSettings.height),
    outputFolder: storeSettings.data.outputSettings.outputFolder
  }

  let imageOrder = 1
  files.map((file) => {
    const inputFileLocation = file.path
    const outputFileLocation = `${settings.outputFolder}${file.name}`

    sharp(inputFileLocation)
      .resize(settings.width, settings.height)
      .toFile(outputFileLocation, (err, info) => {
        if (err) {
          window.alert(err)
        }

        dropHereViewSelector.innerHTML = `${imageOrder} / ${totalFiles}`

        if (imageOrder === totalFiles) {
          dropHereViewSelector.innerHTML = `${totalFiles} ${totalFiles > 1 ? 'Images' : 'Image'} Resized`
          setTimeout(() => {
            dropHereViewSelector.innerHTML = 'Drop Here'
          }, 2000)
        }

        imageOrder++
      })
  })
}

dropHereViewSelector.onclick = () => {
  selectFilesInputSelector.click()
}
selectFilesInputSelector.onchange = () => {
  const files = selectFilesInputSelector.files
  resizeImages({ files: files })
}

dropHereViewSelector.ondragover = (e) => {
  e.preventDefault()
  document.body.classList = 'ondrag'
}
dropHereViewSelector.ondragleave = (e) => {
  e.preventDefault()
  document.body.classList = ''
}
dropHereViewSelector.ondrop = (e) => {
  e.preventDefault()
  document.body.classList = ''

  const files = e.dataTransfer.files
  resizeImages({ files: files })
}

let isSettingsViewOpen = false
gearSelector.addEventListener('click', () => {
  if (isSettingsViewOpen) {
    dropHereViewSelector.parentNode.classList = 'view show'
    settingsViewSelector.parentNode.classList = 'view'
    isSettingsViewOpen = false
  } else {
    dropHereViewSelector.parentNode.classList = 'view'
    settingsViewSelector.parentNode.classList = 'view show'
    isSettingsViewOpen = true
  }
})

settingsFormSelector.addEventListener('submit', (e) => {
  e.preventDefault()

  const widthInputValue = widthInputSelector.value
  const heightInputValue = heightInputSelector.value
  const outputFolderInputValue = outputFolderInputSelector.value

  storeSettings.set('outputSettings', {
    width: widthInputValue,
    height: heightInputValue,
    outputFolder: outputFolderInputValue
  })

  saveButtonSelector.innerHTML = 'Saved'
  setTimeout(() => {
    saveButtonSelector.innerHTML = 'Save'
  }, 2000)
})
