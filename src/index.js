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

const settingsFormSelector = document.getElementById('settingsForm')
const widthInputSelector = document.getElementById('widthInput')
const heightInputSelector = document.getElementById('heightInput')
const outputFolderInputSelector = document.getElementById('outputFolderInput')
const saveButtonSelector = document.getElementById('saveButton')

widthInputSelector.value = storeSettings.data.outputSettings.width
heightInputSelector.value = storeSettings.data.outputSettings.height
outputFolderInputSelector.value = storeSettings.data.outputSettings.outputFolder

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

  const selectedFiles = e.dataTransfer.files
  const files = []
  Object.keys(selectedFiles).map((key) => {
    const file = selectedFiles[key]
    files[key] = {
      name: file.name,
      path: file.path
    }
  })
  const totalFiles = Object.keys(files).length

  const opts = {
    width: parseInt(storeSettings.data.outputSettings.width),
    height: parseInt(storeSettings.data.outputSettings.height),
    outputFolder: storeSettings.data.outputSettings.outputFolder
  }

  files.map((file, i) => {
    const imageOrder = i + 1
    const inputFileLocation = file.path
    const outputFileLocation = `${opts.outputFolder}${file.name}`

    sharp(inputFileLocation)
      .resize(opts.width, opts.height)
      .toFile(outputFileLocation, (err, info) => {
        if (err) {
          window.alert(err)
        }

        dropHereViewSelector.innerHTML = `${imageOrder} / ${totalFiles}`

        if (imageOrder === totalFiles) {
          dropHereViewSelector.innerHTML = `${totalFiles} Image Resized`
          setTimeout(() => {
            dropHereViewSelector.innerHTML = 'Drop Here'
          }, 3000)
        }
      })
  })
}

let isSettingsViewOpen = false
gearSelector.addEventListener('click', () => {
  if (isSettingsViewOpen) {
    isSettingsViewOpen = false
    dropHereViewSelector.parentNode.classList = 'view show'
    settingsViewSelector.parentNode.classList = 'view'
  } else {
    isSettingsViewOpen = true
    dropHereViewSelector.parentNode.classList = 'view'
    settingsViewSelector.parentNode.classList = 'view show'
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
  }, 3000)
})
