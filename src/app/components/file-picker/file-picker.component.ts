import JSZip from 'jszip';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-picker',
  imports: [CommonModule],
  templateUrl: './file-picker.component.html',
  styleUrl: './file-picker.component.scss'
})
export class FilePickerComponent {
  @Input() preview: string | null = null;
  @Input() accept: string = 'image/*';
  @Input() label: string = 'Choose file';
  @Input() type: 'image' | 'file' = 'image';
  @Output() onChange = new EventEmitter<File|null>();

  readonly imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'] as const;
  readonly documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'] as const;

  localFile: File | null = null;

  fileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.onChange.emit(input.files[0]);

      const fileExtension = input.files[0].name.split('.').pop()?.toLowerCase();
      const fileName = input.files[0].name;

      if (this.type == 'image' && fileExtension && this.imageExtensions.includes(fileExtension as any)) {
        this.convertToWebP(input.files[0]).then((blob) => {
          console.log(blob);

          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview = e.target?.result as string;
            this.localFile = new File([blob], fileName+".webp", { type: 'image/webp' });
            this.onChange.emit(this.localFile);
          };
          reader.readAsDataURL(blob);
        });
      }else if(fileExtension){
        this.preview = 'assets/images/document.png';
        this.zipFile(input.files[0]).then((blob) => {
          console.log(blob);
          this.localFile = new File([blob], fileName+'.zip', { type: 'application/zip' });
          this.onChange.emit(this.localFile);
        });
      }
    }else{
      this.onChange.emit(null);
      this.preview = null;
    }
  }

  zipFile(file:File): Promise<Blob> {
    return new Promise((resolve,reject)=>{
      // zip file using jszip
      const zip = new JSZip();
      zip.file(file.name, file);
      zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
       })
        .then((blob:any) => {
          resolve(blob);
        })
        .catch((error:any) => {
          reject(error);
        });
    });
  }

  convertToWebP(file: File, quality: number = 0.5): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to load file.'));
        }
      };

      reader.onerror = reject;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Conversion failed')),
            'image/webp',
            quality
          );
        } else {
          reject(new Error('Unable to get canvas context'));
        }
      };

      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
