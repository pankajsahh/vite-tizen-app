
export default function FoundFilesInLocalStorage(filearray:any[], id:string) {
    if (!filearray) return false;
    let filesarray = filearray;
    for (let i = 0; i < filesarray.length; i++) {
      if (filesarray[i].id == id) {
        return true;
      }
    }
    return false;
  }