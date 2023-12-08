class API {
      constructor() {
            this.service = ZOHO.CREATOR;
            this.init = this.service.init();
            this.apiPoint = this.service.API;
      }

      getParams(callback) {
            const service = this.service;
            this.init.then(function(data) {
                  callback(service.UTIL.getQueryParams());

            })

      }

      addRecord(dataset, callback) {
            this.init.then(function(data) {
                  api.apiPoint.addRecord(dataset).then(function(response) {
                        callback(response);

                  })
            })
      }

      getAllRecords(dataset, callback, failedCall) {

            this.init.then(function(data) {
                  api.apiPoint.getAllRecords(dataset).then(function(response) {
                        callback(response);

                  },function(error) {
				console.log(error);
				failedCall(error)
			})
            })

      }

      getRecordById(dataset, callback) {

            this.init.then(function(data) {
                  api.apiPoint.getRecordById(dataset).then(function(response) {

                        callback(response)
                  });

            })

      }

      uploadFile(dataset, callback) {
            this.init.then(function(data) {
                  api.apiPoint.uploadFile(dataset).then(function(response) {
                        callback(response)
                  });

            })


      }

      readFile(dataset, callback) {
            this.init.then(function(data) {
                  api.apiPoint.readFile(dataset).then(function(response) {
                        callback(response)
                  });

            })


      }




}

const api = new API();


let fileSystem;


// api.getAllRecords(
// 	{
// 		reportName: 'All_Folders'
// 	},
// 	function(data) {
// 		console.log(data);
	
// 	}
// )

api.getAllRecords({
            reportName: 'All_Files',
		pageSize: 200
      },
      function(data) {
            console.log(data);
		loaderInterface.remove()

            fileSystem = new FileSystem(data.data);
            fileSystem.establish();

      },
	function(data) {

		loaderInterface.remove();
		
		fileSystem = new FileSystem([]);

            fileSystem.establish();

	}

)

class CreateNew {
      create(element) {
            return document.createElement(element)
      }
      add(element, classes) {
            let createdElement = this.create(element);
            for (let eachClass of classes) {
                  createdElement.classList.add(eachClass)
            }
            return createdElement;
      }
      push(element, classes, parent) {
            let createdElement = this.add(element, classes);
            parent.appendChild(createdElement);
            return createdElement;
      }
      pushP(element, classes, parent) {
            let createdElement = this.add(element, classes);
            parent.prepend(createdElement);
            return createdElement;
      }
}

let doc = new CreateNew();


const loaderInterface = doc.push('div',['loader-wrapper'],document.querySelector('body'));
const spinnerWrapper = doc.push('div',['spinner-wrapper'],loaderInterface);

doc.push('span',['spinner-1'],doc.push('span',['loader'],spinnerWrapper));

console.log(loaderInterface)





	for (let src of ['pdf.png','excel.png','excel.png','jpeg.png','zip.png','png.png','ds.png','mp3.png','mp4.png','foldermac.png']) {
		new Image().src = src;
	}



 


class FileSystem {
      constructor(data) {
            this.data = data;
            this.folderID = null;
		this.folderName = null;
		this.tabName = 'Recent Files';
            this.tabID = null;
		this.foldersArray = [];
		this.actualFileHolder = null;
		this.actualFolderHolder = null;
		this.uploadTimingBox = null;
		this.uploadedFileContainer = null;
            this.body = document.querySelector('body');
            this.fileIcons = {
                  pdf: 'pdf.png',
                  xlsx: 'excel.png',
                  xls: 'excel.png',
                  jpeg: 'jpeg.png',
                  zip: 'zip.png',
			png: 'png.png',
			ds: 'ds.png',
			mp3: 'mp3.png',
			mp4: 'mp4.png'

            }


      }

      createSkeleton() {
            this.container = doc.push('div', ['container'], this.body);
            this.tabSection = doc.push('div', ['tab_section'], this.container);
            this.contentSection = doc.push('div', ['content_section'], this.container);
            this.createTabSection();
            this.createContentSection();

      }

      createTabSection() {
            doc.push('div', ['theme'], this.tabSection).innerText = 'ZC - File Management System';
            this.fileTabsContainer = doc.push('div', ['tabs_container'], this.tabSection);
            const recentFiles = doc.push('span', ['file_tab', 'file_tab_selected'], this.fileTabsContainer);
            this.selectedTab = recentFiles;
            recentFiles.innerText = 'Recent Files';

	

		recentFiles.addEventListener('click', function() {

			if (fileSystem.selectedTab != recentFiles) {
				let tabTop = document.querySelector('.tab_name');
				tabTop.innerText = '';
				doc.push('i',['bi','bi-clock-history'],tabTop);
				doc.push('span',[],tabTop).innerText = 'Recent Files';
				fileSystem.tabName = 'Recent Files';
				document.querySelector('.create_folder').classList.add('disable');
				document.querySelector('.custom-file-upload').classList.add('disable');
				document.querySelector('.custom-file-input').disabled = true;
				
				fileSystem.storageHeader.innerText = '';
				fileSystem.storageContent.innerText = '';

				let bool = false;
				for (let eachFiles of fileSystem.data) {
					let anc = doc.push('a',[],fileSystem.storageContent);
					let fileContainer = doc.push('div', ['file_cont_latest'], anc);
					const fileAPIstring = eachFiles.File_upload;
					if (fileAPIstring) {
						bool = true;
						const probableExtension = fileAPIstring.split('.');
						doc.push('img', ['file_ic'], fileContainer).src = fileSystem.fileIcons[probableExtension[probableExtension.length - 1]];
						const afterFilePathString = fileAPIstring.split('=')[1];
						anc.href = fileSystem.createDownloadableLink(eachFiles.ID,afterFilePathString)
						doc.push('span', ['recent_file_name'], fileContainer).innerText = afterFilePathString.substring(14, afterFilePathString.length);

					} else {
						fileContainer.remove();

					}

				}

				if (!bool) {
					let noFiles = doc.push('div',['no_data'],fileSystem.storageContent);
					doc.push('img',['empty_fil'],noFiles).src = 'https://png.pngtree.com/png-vector/20221227/ourmid/pngtree-hand-drawn-app-folder-empty-state-vector-illustration-png-image_6507785.png';
					doc.push('div',['empty_text'],noFiles).innerText = 'No files have been added recently'

				}

				fileSystem.selectedTab.classList.remove('file_tab_selected');

				recentFiles.classList.add('file_tab_selected');


				fileSystem.selectedTab = recentFiles;

			}

			

		})

            doc.pushP('i', ['bi', 'bi-clock-history'], recentFiles);

            const myFolder = doc.push('span', ['file_tab'], this.fileTabsContainer);
            myFolder.innerText = 'My Folder';
		myFolder.addEventListener('click', function() {
			if (myFolder != fileSystem.selectedTab) {
				myFolder.classList.add('file_tab_selected');
				fileSystem.selectedTab.classList.remove('file_tab_selected');
				fileSystem.selectedTab = myFolder;
				fileSystem.tabNameDiv.innerText = '';
				doc.push('i', ['bi', 'bi-folder2'], fileSystem.tabNameDiv);
				doc.push('span', [], fileSystem.tabNameDiv).innerText = 'My Folder';

				fileSystem.createTabActions({
					tab: {
						display_value: 'My Folder',
						ID: '1'
					}
				});

			}
		})
            doc.pushP('i', ['bi', 'bi-folder'], myFolder);

      }


      createTabActions(eachTab) {


		document.querySelector('.create_folder').classList.remove('disable');
		document.querySelector('.custom-file-upload').classList.remove('disable');
		document.querySelector('.custom-file-input').disabled = false;



            fileSystem.storageContent.innerText = '';
            fileSystem.storageHeader.innerText = '';
		fileSystem.foldersArray = [];
		fileSystem.tabID = eachTab.tab.ID;
		console.log(eachTab)
		fileSystem.tabName = eachTab.tab.display_value;
		fileSystem.folderID = null;
		fileSystem.folderName = null;

            const folders = [];
		const fileSec = doc.push('div',['fold_sec_in'],fileSystem.storageContent);
		// doc.push('div',['content_text','ads'],fileSec).innerText = 'Files';
		fileSystem.actualFileHolder = fileSec;
		doc.push('a',[],fileSystem.actualFileHolder)

            for (let eachFiles of fileSystem.data) {
                  if (eachFiles.Tab.ID == eachTab.tab.ID && !eachFiles['Folder.Great_Folder'] && eachFiles.Folder.display_value ) {
                        folders.push(eachFiles.Folder)

                  }
			if (!eachFiles.Folder.display_value && eachFiles.Tab.ID == fileSystem.tabID ) {	
				let anc = doc.push('a',[],fileSystem.actualFileHolder);			
                        let fileContainer = doc.push('div', ['file_cont_latest'], anc);
                        const fileAPIstring = eachFiles.File_upload;
				if (fileAPIstring) {
					const probableExtension = fileAPIstring.split('.');
					doc.push('img', ['file_ic'], fileContainer).src = fileSystem.fileIcons[probableExtension[probableExtension.length - 1]];
					const afterFilePathString = fileAPIstring.split('=')[1];
					anc.href = this.createDownloadableLink(eachFiles.ID,afterFilePathString);
					doc.push('span', ['recent_file_name'], fileContainer).innerText = afterFilePathString.substring(14, afterFilePathString.length);

				} else {
					fileContainer.remove();
				}
                        

                  }

            }

            function distinctTabs(array) {
                  const seen = new Set();
                  return array.filter((obj) => {
                        const key = JSON.stringify(obj);
                        return seen.has(key) ? false : seen.add(key);
                  });
            }

		const folderSec = doc.pushP('div',['fold_sec_in'],fileSystem.storageContent);
		// doc.push('div',['content_text'],folderSec).innerText = 'Folders';
		fileSystem.actualFolderHolder = folderSec;

		if (folders.length == 0) {
			folderSec.remove();

		}

            for (let eachFolder of distinctTabs(folders)) {
                  const folderHolder = doc.push('div', ['folder_par'], fileSystem.actualFolderHolder);
                  doc.push('img', ['folder_img'], folderHolder).src = 'foldermac.png';
                  doc.push('div', ['folder_name'], folderHolder).innerText = eachFolder.display_value;

                  folderHolder.addEventListener('click', function() {
                        fileSystem.createFolderActions(eachFolder, eachTab);

                  })



            }

      }


	createFolderTreeAction(folderName,tabName) {
		fileSystem.storageContent.innerText = '';
		console.log(folderName);
		const folders = [];
		const fileSec = doc.push('div',['fold_sec_in'],fileSystem.storageContent);
		// doc.push('div',['content_text','ads'],fileSec).innerText = 'Files';
		fileSystem.actualFileHolder = fileSec;
		doc.push('a',[],fileSystem.actualFileHolder)
		
            for (let eachFilesInFolder of fileSystem.data) {
			if (eachFilesInFolder['Folder.Great_Folder'] == folderName.folderName) {
				folders.push(eachFilesInFolder.Folder)
				
			}
                  if (eachFilesInFolder.Folder.display_value == folderName.folderName ) {	
				let anc = doc.push('a',[],fileSystem.actualFileHolder);			
                        let fileContainer = doc.push('div', ['file_cont_latest'], anc);
                        const fileAPIstring = eachFilesInFolder.File_upload;
				if (fileAPIstring) {
					const probableExtension = fileAPIstring.split('.');
					doc.push('img', ['file_ic'], fileContainer).src = fileSystem.fileIcons[probableExtension[probableExtension.length - 1]];
					const afterFilePathString = fileAPIstring.split('=')[1];
					anc.href = this.createDownloadableLink(eachFilesInFolder.ID,afterFilePathString);
					doc.push('span', ['recent_file_name'], fileContainer).innerText = afterFilePathString.substring(14, afterFilePathString.length);

				} else {
					fileContainer.remove();
				}
                        

                  }

            }

		console.log(folders);
		function distinctTabs(array) {
                  const seen = new Set();
                  return array.filter((obj) => {
                        const key = JSON.stringify(obj);
                        return seen.has(key) ? false : seen.add(key);
                  });
            }

		const folderSec = doc.pushP('div',['fold_sec_in'],fileSystem.storageContent);
		// doc.push('div',['content_text'],folderSec).innerText = 'Folders';
		fileSystem.actualFolderHolder = folderSec;

		for (let eachFolder of distinctTabs(folders)) {
			
                  const folderHolder = doc.push('div', ['folder_par'], fileSystem.actualFolderHolder);
                  doc.push('img', ['folder_img'], folderHolder).src = 'foldermac.png';
                  doc.push('div', ['folder_name'], folderHolder).innerText = eachFolder.display_value;
                  folderHolder.addEventListener('click', function() {
                        fileSystem.createFolderActions(eachFolder, tabName);

                  })

			

            }

	}


      createFolderActions(eachFolder, eachTab) {
            fileSystem.folderID = eachFolder.ID;
            fileSystem.tabID = eachTab.tab.ID;
		
		const newObj = {
			folderName: eachFolder.display_value,
			call: []
		};
		fileSystem.foldersArray.push(newObj);
		fileSystem.folderName = eachFolder.display_value;
		fileSystem.tabName = eachTab.tab.display_value;
            fileSystem.storageContent.innerText = '';
		fileSystem.storageHeader.innerText = '';
            doc.push('i', ['bi', 'bi-folder'], fileSystem.storageHeader).addEventListener('click', function() {
                  fileSystem.createTabActions(eachTab);

            });

		const folderOpend = [];

		for (let openedFolder of fileSystem.foldersArray) {
			doc.push('i', ['bi', 'bi-chevron-right'], fileSystem.storageHeader);
            	let thisFolderValue = doc.push('span', ['tree_text', 'current_folder_view'], fileSystem.storageHeader);
			folderOpend.push(thisFolderValue);
			thisFolderValue.innerText = openedFolder.folderName;

		}


            
            doc.push('hr', [], fileSystem.storageHeader);
		const folders = [];
		const folderTab = [];
		const fileSec = doc.push('div',['fold_sec_in'],fileSystem.storageContent);
		// doc.push('div',['content_text','ads'],fileSec).innerText = 'Files';
		fileSystem.actualFileHolder = fileSec;
		doc.push('a',[],fileSystem.actualFileHolder)
		
            for (let eachFilesInFolder of fileSystem.data) {
			if (eachFilesInFolder['Folder.Great_Folder'] == fileSystem.folderName) {
				folders.push(eachFilesInFolder.Folder)
				
			}
                  if (eachFilesInFolder.Folder.ID == eachFolder.ID ) {
				let anc = doc.push('a',[],fileSystem.actualFileHolder);				
                        let fileContainer = doc.push('div', ['file_cont_latest'], anc);
                        const fileAPIstring = eachFilesInFolder.File_upload;
				if (fileAPIstring) {
					const probableExtension = fileAPIstring.split('.');
					doc.push('img', ['file_ic'], fileContainer).src = fileSystem.fileIcons[probableExtension[probableExtension.length - 1]];
					const afterFilePathString = fileAPIstring.split('=')[1];
					anc.href = this.createDownloadableLink(eachFilesInFolder.ID,afterFilePathString);
					doc.push('span', ['recent_file_name'], fileContainer).innerText = afterFilePathString.substring(14, afterFilePathString.length);

				} else {
					fileContainer.remove();
				}
                        

                  }

            }

		

		

		function distinctTabs(array) {
                  const seen = new Set();
                  return array.filter((obj) => {
                        const key = JSON.stringify(obj);
                        return seen.has(key) ? false : seen.add(key);
                  });
            }

		const folderSec = doc.pushP('div',['fold_sec_in'],fileSystem.storageContent);
		// doc.push('div',['content_text'],folderSec).innerText = 'Folders';
		fileSystem.actualFolderHolder = folderSec;

		let count = 0;

		console.log(folderOpend)

		let sop = [];

		if (folders.length == 0) {
			folderSec.remove()

		}

		for (let eachFolder of distinctTabs(folders)) {
			
                  const folderHolder = doc.push('div', ['folder_par'], fileSystem.actualFolderHolder);
                  doc.push('img', ['folder_img'], folderHolder).src = 'foldermac.png';
                  doc.push('div', ['folder_name'], folderHolder).innerText = eachFolder.display_value;



                  folderHolder.addEventListener('click', function() {
                        fileSystem.createFolderActions(eachFolder, eachTab);

                  })

			

            }

		console.log(folderOpend);
		
            let inc = 0;

		console.log(fileSystem.foldersArray)

		for (let uio of fileSystem.foldersArray) {
			folderOpend[count].addEventListener('click', function(event) {
				fileSystem.createFolderTreeAction(uio,eachTab);
				
				let thisElement = event.target;
				let thisParent = [...event.target.parentElement.children];

				// 

				function findArrayIndex(array) {
					for (let thisin in array) {
						if (array[thisin].folderName == uio.folderName) {
							return thisin;

						}
					}
				}

				let arrayStartIndex = findArrayIndex(fileSystem.foldersArray);
				for (let i = +arrayStartIndex + 1; i < fileSystem.foldersArray.length; i++ ) {
					console.log(fileSystem.foldersArray.splice(i,1));
					i--;


				}

				console.log(fileSystem.foldersArray);


				

				// console.log(fileSystem.foldersArray)

				for (let j = thisParent.indexOf(thisElement) + 1; j < thisParent.length; j++  ) {
					thisParent[j].remove();

				}

				
				


			})
			
			count++;
			inc++;

		}

		console.log(fileSystem.foldersArray);

      }


      createUserCreatedFolders(data) {

            console.log(data);

            const myFolder = doc.push('span', ['file_tab', 'mar_50'], this.fileTabsContainer);
            myFolder.innerText = 'User Created Folders';
		doc.push('i',['bi','bi-plus-circle'],myFolder).addEventListener('click', function() {
			const myFolder = doc.pushP('span', ['file_tab'], fileSystem.customTabHolder);
			let input = doc.push('input',[],myFolder);
			input.addEventListener('keydown',function(event) {
				if (event.key == 'Enter') {

					fileSystem.tabName = this.value;
					api.addRecord({
						formName: 'Tabs',
						data: {
							data: {
								Tab_Name: this.value

							}
						}
					},
					function(data) {
						console.log(data);

						
						fileSystem.tabID = data.data.ID;
						api.addRecord({
							formName: 'Files',
							data: {
								data: {
									Name: '',
									Folder: null,
									Tab: fileSystem.tabID
								}
							}
						},
						function(data) {
							document.querySelector('.create_folder').classList.remove('disable');
							document.querySelector('.custom-file-upload').classList.remove('disable');
							document.querySelector('.custom-file-input').disabled = false;
							console.log('Dynamic Folder Created!')
							console.log(data);

							fileSystem.data.push({
								Tab: {
									display_value: fileSystem.tabName,
									ID: fileSystem.tabID,
	
								},
								Name: null,
								['Folder.Great_Folder']: '',
								ID: null,
								Folder: {
									display_value: '',
									ID: null	
								}
	
							});

							fileSystem.storageContent.innerText = '';
							fileSystem.storageHeader.innerText = '';
							const fileSec = doc.push('div',['fold_sec_in'],fileSystem.storageContent);
							// doc.push('div',['content_text','ads'],fileSec).innerText = 'Files';
							fileSystem.actualFileHolder = fileSec;
							doc.push('a',[],fileSystem.actualFileHolder)
							fileSystem.foldersArray = [];
							fileSystem.folderID = null;
							fileSystem.folderName = null;
							const tabName = fileSystem.tabName;
							const tabID = fileSystem.tabID;

							myFolder.addEventListener('click', function() {
								if (myFolder != fileSystem.selectedTab) {
									myFolder.classList.add('file_tab_selected');
									fileSystem.selectedTab.classList.remove('file_tab_selected');
									fileSystem.selectedTab = myFolder;
									fileSystem.tabNameDiv.innerText = '';
									doc.push('i', ['bi', 'bi-folder2'], fileSystem.tabNameDiv);
									doc.push('span', [], fileSystem.tabNameDiv).innerText = fileSystem.tabName;
				
									fileSystem.createTabActions({
										tab: {
										    display_value: tabName,
										    ID: tabID
										}
									  });
				
								}
								
				
							})

							input.remove();
							fileSystem.selectedTab.classList.remove('file_tab_selected');
							myFolder.classList.add('file_tab_selected');
							fileSystem.selectedTab = myFolder;
							
							
							doc.push('span',[],myFolder).innerText = fileSystem.tabName;
							

						})

					})
				}
				
			})
			input.focus();
                  // myFolder.innerText = 'erferger';
                  doc.pushP('i', ['bi', 'bi-folder2'], myFolder);


		});

		this.customTabHolder = doc.push('div',[],this.fileTabsContainer)

            for (let eachTab of data) {
			if (eachTab.tab.display_value != 'My Folder') {
				const myFolder = doc.push('span', ['file_tab'], this.customTabHolder);
				myFolder.innerText = eachTab.tab.display_value;
				doc.pushP('i', ['bi', 'bi-folder2'], myFolder);
				myFolder.addEventListener('click', function() {
					if (myFolder != fileSystem.selectedTab) {
						myFolder.classList.add('file_tab_selected');
						fileSystem.selectedTab.classList.remove('file_tab_selected');
						fileSystem.selectedTab = myFolder;
						fileSystem.tabNameDiv.innerText = '';
						doc.push('i', ['bi', 'bi-folder2'], fileSystem.tabNameDiv);
						doc.push('span', [], fileSystem.tabNameDiv).innerText = eachTab.tab.display_value;

						fileSystem.createTabActions(eachTab);

					}
					

				})

			}
                  

            }



      }

	createFolderMethod() {
		console.log(fileSystem.data)
		console.log(fileSystem.tabID, fileSystem.tabName,fileSystem.folderID, fileSystem.folderName );

		

		if ([...fileSystem.storageContent.children].length == 1) {
			const folderSec = doc.pushP('div',['fold_sec_in'],fileSystem.storageContent);
			// doc.push('div',['content_text'],folderSec).innerText = 'Folders';
			fileSystem.actualFolderHolder = folderSec;

		}

		const folderHolder = doc.push('div', ['folder_par'], fileSystem.actualFolderHolder);
		doc.push('img', ['folder_img'], folderHolder).src = 'foldermac.png';
		const fileNameHolder = doc.push('div', ['folder_name'], folderHolder);
		fileNameHolder.setAttribute('contentEditable',true);
		fileNameHolder.innerText = 'untitled';
		fileNameHolder.focus();

		fileNameHolder.addEventListener('keydown', function(event) {
			console.log(event.key)
			if (event.key == 'Enter') {

				console.log('Success');
				api.addRecord(
					{
						formName: 'Folders',
						data: {
							data: {
								Tab: fileSystem.tabID,
								Great_Folder: fileSystem.folderID ? fileSystem.folderID : null,
								Folder_Name: fileNameHolder.innerText
							}
						}
					},
					function(data) {
						console.log(data);
						api.addRecord({
								formName: 'Files',
								data: {
									data: {
										Name: '',
										Folder: data.data.ID,
										Tab: fileSystem.tabID
									}
								}
							},
							function(data) {
								'Follow UPQ!'
								console.log(data)
							}
						
						
						)

						fileSystem.data.push({
							Tab: {
								display_value: fileSystem.tabName,
								ID: fileSystem.tabID,

							},
							Name: null,
							['Folder.Great_Folder']: fileSystem.folderName,
							ID: null,
							Folder: {
								display_value: fileNameHolder.innerText,
								ID: data.data.ID

								
							}

						})
						fileNameHolder.setAttribute('contentEditable',false);

						folderHolder.addEventListener('click',function() {
							fileSystem.createFolderActions({
								display_value: fileNameHolder.innerText,
								ID: data.data.ID,
								tab: {
									ID: data.data.ID

								}
							}, {
								display_value: fileSystem.tabName,
								ID: fileSystem.tabID,
								tab: {
									ID: fileSystem.tabID

								}
							});

						})



					}
				)
				event.preventDefault();

			} else if (event.key == 'Backspace'){
				if (fileNameHolder.innerText.trim().length == 0) {
					folderHolder.remove();

				}
			

			}

			
			
		})
		

		

		
	}

	createDownloadableLink(recID,filePath) {
		//https://8935-w22-1:8443/appcreatorsupport_manageengine/creator-file-system/report/All_Files/3/File_upload/download-file?filepath=/1701303619131_SMB.ds
		//const raw = 'https://8935-w22-1:8443/appcreatorsupport_manageengine/creator-file-system/report/All_Files/4258555000006794235/File_upload/download-file?filepath=/1700808948473_workflow-wizard.jpeg&mediaType=3';
		const first = 'https://8935-w22-1:8443/appcreatorsupport_manageengine/creator-file-system/report/All_Files/' + recID ;
		const second = '/File_upload/download-file?filepath=/';

		return first + second + filePath + '&mediaType=3';



	}

      createFileUploadField(contentHeader) {
		let upWithFoldCreation = doc.push('div',['folder_up'],contentHeader);
		// let anc = doc.push('a',[],upWithFoldCreation);
		// anc.setAttribute('href','https://creatorapp.zoho.com/zcapps/creator-file-system/report/All_Files/4258555000006794235/File_upload/download-file?filepath=/1700808948473_workflow-wizard.jpeg&mediaType=3')
		let createFolder = doc.push('span', ['create_folder','disable'], upWithFoldCreation);
		createFolder.innerText = 'New Folder';
		createFolder.addEventListener('click', function() {
			if (fileSystem.tabName != 'Recent Files') {
				console.log(fileSystem.tabID, fileSystem.tabName, fileSystem.folderID, fileSystem.folderName );

			      fileSystem.createFolderMethod()

			}

			
		})
		doc.pushP('i',['bi','bi-folder-plus'],createFolder);
            let uploadSection = doc.push('div', ['uplaod'], upWithFoldCreation);
            let labelHolder = doc.push('label', ['custom-file-upload','disable'], uploadSection);
            labelHolder.setAttribute('for', 'fileInput');
            doc.push('i', ['bi', 'bi-upload'], labelHolder);
            doc.push('span', [], labelHolder).innerText = 'Upload File';
            let fileUploadInput = doc.push('input', ['custom-file-input'], labelHolder);
		fileUploadInput.disabled = true;
            fileUploadInput.id = 'fileInput';
            fileUploadInput.type = 'file';
            fileUploadInput.addEventListener('change', function() {



                  
                  const file = fileUploadInput.files[0];
			if (file.name) {
				let fileSize = (file.size / 1024).toFixed(2);
				if (fileSystem.uploadTimingBox == null) {
					fileSystem.uploadTimingBox = doc.push('div', ['file_upload_loader'], fileSystem.body);
					doc.push('div', ['file_uploder_head'], fileSystem.uploadTimingBox).innerText = 'Uploading 1 Document';
					doc.push('i',['bi','bi-x'],fileSystem.uploadTimingBox).addEventListener('click',function() {
						fileSystem.uploadTimingBox = fileSystem.uploadTimingBox.remove();
						fileSystem.uploadedFileContainer = fileSystem.uploadedFileContainer.remove();


					});
					fileSystem.uploadedFileContainer = doc.push('div',[],fileSystem.uploadTimingBox);

				}
				// const uploadTimingBox = doc.push('div', ['file_upload_loader'], fileSystem.body);
				
				
				const uploadedFileDataInfo = doc.pushP('div', ['uploaded_file_info'], fileSystem.uploadedFileContainer);
				doc.push('img', ['file_ic', 'above_b_bar'], uploadedFileDataInfo).src = 'upload.png';
				doc.push('span', ['file_name'], uploadedFileDataInfo).innerText = file.name;
				doc.push('span',['file_size'],uploadedFileDataInfo).innerText = `${fileSize} kb`;
				const loader = doc.push('span',['loader_i'],uploadedFileDataInfo);
				// 
				doc.push('img',['loder_gif'],loader).src='https://sonobel.com.br/assets/img/loading%20(2).gif';
				
				let trackBar = doc.push('div',['tracking_bar'],doc.push('div', ['file_upload_bar'], uploadedFileDataInfo))
                        let trackingRatio = 100 / +fileSize;
				trackBar.style.width = `${trackingRatio}%`;
				
				function trackingBarRun() {
					let totalWidth = parseFloat(trackBar.style.width) + trackingRatio;
					trackBar.style.width = `${totalWidth}%`;
					if (totalWidth > 80) {
						clearInterval(interval)
					}

				}

				let interval = setInterval(trackingBarRun,5)

				api.addRecord({
						formName: 'Files',
						data: {
							data: {
								Name: file.name,
								Folder: fileSystem.folderID,
								Tab: fileSystem.tabID
							}
						}
					},

					function(data) {
						console.log(data.data.ID);

						const fileRecordId = data.data.ID;

						api.uploadFile({
								reportName: 'All_Files',
								id: data.data.ID,
								fieldName: 'File_upload',
								file: file

							},

							function(data) {
								
								loader.innerText = '';
								doc.push('i',['bi','bi-check-circle-fill'],loader);
								clearInterval(interval);
								trackBar.style.width = '100%';
								console.log(data);
								fileSystem.loadUploadedFile(data.data,fileRecordId);


								//

								console.log(fileSystem.foldersArray);

								let inc = 0;
								let greatFolder;

								for (let thisGP of fileSystem.foldersArray) {
									if (thisGP.folderName == fileSystem.folderName) {
										console.log(fileSystem.foldersArray[inc - 1]);
										if (inc > 0) {
											greatFolder = (fileSystem.foldersArray[inc - 1]).folderName;

										}
										
										console.log(greatFolder)

										break;
									}
									inc++;

								}




								


								console.log({
									Tab: {
										display_value: fileSystem.tabName,
										ID: fileSystem.tabID,
		
									},
									Name: file.name,
									['Folder.Great_Folder']: greatFolder,
									ID: fileRecordId,
									File_upload: '/api/v2/zcapps/creator-file-system/report/All_Files/4258555000006794191/File_upload/download?filepath=' + data.data.filepath,
									Folder: {
										display_value: fileSystem.folderName,
										ID: fileSystem.folderID
		
										
									}

		
								})

								fileSystem.data.push({
									Tab: {
										display_value: fileSystem.tabName,
										ID: fileSystem.tabID,
		
									},
									Name: file.name,
									['Folder.Great_Folder']: greatFolder,
									ID: fileRecordId,
									File_upload: '/api/v2/zcapps/creator-file-system/report/All_Files/4258555000006794191/File_upload/download?filepath=' + data.data.filepath,
									Folder: {
										display_value: fileSystem.folderName,
										ID: fileSystem.folderID
		
										
									}
								})
							}
						)


					}
				)

			}

			fileUploadInput.value = '';


                  




            })

      }

      createContentSection() {
            let contentHeader = doc.push('div', ['content_header'], this.contentSection);
            this.tabNameDiv = doc.push('div', ['tab_name'], contentHeader);
            doc.push('i', ['bi', 'bi-folder'], this.tabNameDiv);
            doc.push('span', [], this.tabNameDiv).innerText = 'Recent Files';
            this.createFileUploadField(contentHeader);
            this.storageBox = doc.push('div', ['strorage_container'], this.contentSection);
            this.storageHeader = doc.push('div', ['strorage_header'], this.storageBox);
            this.storageContent = doc.push('div', ['strorage_content'], this.storageBox);


      }

      loadRecentFiles(data) {
            const customTabs = [];
            fileSystem.storageHeader.innerText = '';
		fileSystem.storageContent.innerText = '';

		let bool = false;
            for (let eachFiles of fileSystem.data) {
			let anc = doc.push('a',[],fileSystem.storageContent);
                  let fileContainer = doc.push('div', ['file_cont_latest'], anc);
                  const fileAPIstring = eachFiles.File_upload;
			if (fileAPIstring) {
				bool = true;
				const probableExtension = fileAPIstring.split('.');
				doc.push('img', ['file_ic'], fileContainer).src = fileSystem.fileIcons[probableExtension[probableExtension.length - 1]];
				const afterFilePathString = fileAPIstring.split('=')[1];
				anc.href = fileSystem.createDownloadableLink(eachFiles.ID,afterFilePathString)
				doc.push('span', ['recent_file_name'], fileContainer).innerText = afterFilePathString.substring(14, afterFilePathString.length);

			} else {
				fileContainer.remove();

			}
                  
                  let obj = {};
                  if (typeof eachFiles.Tab == 'object') {
                        obj.tab = eachFiles.Tab;
                  }
                  customTabs.push(obj);

            }

		if (!bool) {
			let noFiles = doc.push('div',['no_data'],fileSystem.storageContent);
			doc.push('img',['empty_fil'],noFiles).src = 'https://png.pngtree.com/png-vector/20221227/ourmid/pngtree-hand-drawn-app-folder-empty-state-vector-illustration-png-image_6507785.png';
			doc.push('div',['empty_text'],noFiles).innerText = 'No files have been added recently'

		}


            function distinctTabs(array) {
                  const seen = new Set();
                  return array.filter((obj) => {
                        const key = JSON.stringify(obj);
                        return seen.has(key) ? false : seen.add(key);
                  });
            }

            this.createUserCreatedFolders(distinctTabs(customTabs));
      }

      loadUploadedFile(data,recID) {
		let anc = doc.push('a',[],fileSystem.actualFileHolder);
		anc.href = fileSystem.createDownloadableLink(recID,data.filepath);
            let fileContainer = doc.pushP('div', ['file_cont_latest'], anc);
            const fileAPIstring = data.filename;
            const probableExtension = fileAPIstring.split('.');
            doc.push('img', ['file_ic'], fileContainer).src = this.fileIcons[probableExtension[probableExtension.length - 1]];
            doc.push('span', ['recent_file_name'], fileContainer).innerText = fileAPIstring;


      }

      prepareSystemStructure() {
            const structure = [];
            let exsistance = false;
            let tabsFolder;
            let foldersFile;
            let subFolders;

            

                  for (let eachData of this.data) {


                        for (let thisStructure of structure) {
                              exsistance = false;
                              if (eachData.Tab.display_value == thisStructure.tab) {
                                    exsistance = true;
                                    tabsFolder = thisStructure.folders;
                                    break;
                              }
                        }

                        if (exsistance) {
                              exsistance = false;

                              if (!(eachData['Folder.Great_Folder'].trim())) {

                                    for (let thisTab of structure) {
                                          for (let folders of thisTab.folders) {

                                                if (checkFolder(folders)) {
                                                      break;
                                                }

                                          }

                                    }

                                    function checkFolder(folder) {

                                          if (folder.name == eachData.Folder.display_value) {
                                                exsistance = true;
                                                foldersFile = folder.files;
                                                return true

                                          }


                                          for (let subFolder of folder.subFolders) {
                                                checkFolder(subFolder)
                                          }

                                          return false;
                                    }


                                    if (exsistance) {
                                          exsistance = false;
                                          foldersFile.push({
                                                name: eachData.Name,
                                                file: eachData.File_upload
                                          })


                                    } else {
                                          tabsFolder.push({
                                                      name: eachData.Folder.display_value,
                                                      files: [{
                                                            name: eachData.Name,
                                                            file: eachData.File_upload
                                                      }],
                                                      subFolders: []

                                                }

                                          )

                                    }

                              } else {

                                    console.log(eachData)

                                    for (let thisTab of structure) {
                                          for (let folders of thisTab.folders) {

                                                if (checkFolder(folders)) {
                                                      break;
                                                }

                                          }

                                          if (exsistance) {
                                                console.log('efrefe')
                                                break;
                                          }



                                    }

                                    function checkFolder(folder) {


                                          // console.log(folder.name, eachData['Folder.Great_Folder'],structure);
                                          if (folder.name == eachData['Folder.Great_Folder']) {
                                                console.log(folder);
                                                exsistance = true;
                                                subFolders = folder.subFolders;
                                                return true

                                          } else {
                                                console.log('0000000', folder.subFolders.length);
                                                for (let subFolder of folder.subFolders) {
                                                      console.log(subFolder)

                                                      checkFolder(subFolder)
                                                }
                                          }




                                          return false;
                                    }


                                    if (exsistance) {
                                          exsistance = false;
                                          subFolders.push({
                                                name: eachData.Folder.display_value,
                                                files: [{
                                                            name: eachData.Name,
                                                            file: eachData.File_upload
                                                      }

                                                ],
                                                subFolders: []

                                          })

                                    } else {

                                          

                                          // function deriveGrandFolder() {
                                          // 	if (data.Folder.display_value == eachData['Folder.Great_Folder']) {
                                          // 		if (data['Folder.Great_Folder'].trim()) {

                                          // 			for (let greatSt of structure) {
                                          // 				exsistance = false;
                                          // 				if (data.Tab.display_value == greatSt.tab) {
                                          // 					exsistance = true;
                                          // 					tabsFolder = greatSt.folders;
                                          // 					break;
                                          // 				}    

                                          // 			}
                                          // 		}

                                          // 	}


                                          // }

                                          tabsFolder.push({
                                                      name: eachData['Folder.Great_Folder'],
                                                      files: [],
                                                      subFolders: [{
                                                            name: eachData.Folder.display_value,
                                                            file: [{
                                                                        name: eachData.Name,
                                                                        file: eachData.File_upload
                                                                  }

                                                            ],
                                                            subFolders: []
                                                      }]

                                                }

                                          )

                                    }

                              }




                        } else {




                              structure.push({
                                    tab: eachData.Tab.display_value,
                                    folders: [{
                                          name: eachData.Folder.display_value,
                                          files: [{
                                                name: eachData.Name,
                                                file: eachData.File_upload
                                          }],
                                          subFolders: []

                                    }]
                              })

                        }




                  }

            

		

            console.log(structure);



      }

      establish() {

            // this.prepareSystemStructure();

            this.createSkeleton();
            fileSystem.loadRecentFiles(this.data);

      }
}