import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NoticiaService } from 'src/app/service/noticia.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  // Definición del grupo de controles
  form: FormGroup;
  // Valida si es un nuevo maestro
  isNew: boolean;
  // Params
  params: Params;
  // Profile image
  img = 'https://images.mediotiempo.com/ThihKw1yS3recxD4IK5vp7o_weU=/958x596/uploads/media/2020/12/03/luis-romo-metio-tercero-azul_69_0_1130_703.jpg';
  file: File;

  constructor(
    private userService: NoticiaService, // Servicio de usuarios
    private router: Router, // Clase para hacer la navegación
    private activatedRoute: ActivatedRoute, // Obtener los parámetros de la url
  ) { }

  ngOnInit(): void {
    // Inicializar variables
    this.isNew = true;
    this.file = null;

    // Instancia del grupo de controles
    this.form = new FormGroup({

      notice: new FormControl('', [Validators.required]),
      subtitle: new FormControl('', [Validators.required]),
    });

    // Obtener los parámetros de la url
    this.activatedRoute.params.subscribe(
      async (params: Params) => {
        this.params = params;
        this.isNew = params.NewId === 'new' ? true : false;
        await this.iniValuesHttp();
        console.log('Parametros: ', params);
      }, // Next
      (error: any) => {
        console.log('Error parámetros: ', error);
      }, // Error
      () => { } // Complete
    );

    // this.iniValuesHttp();
  }

  async iniValuesHttp(): Promise<void> {
    try {
      /* this.params = await this.activatedRoute.params.pipe(take(1)).toPromise();
      this.isNew = this.params.NewId === 'new' ? true : false; */

      if (!this.isNew) {
        const news = await this.userService.getNewById(this.params.NewId).toPromise();
        if (news.data()) {
          this.form = new FormGroup({
            notice: new FormControl(news.data().notice, [Validators.required]),
            subtitle: new FormControl(news.data().subtitle, [Validators.required]),
          });
          this.img = news.data().profilePicture ? news.data().profilePicture : this.img;
        }
      } else {
        this.form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Método que agrega un usuario en firebase
   */
  async onAdd(): Promise<void> {
    console.log(this.form);
    if (this.form.valid) {
      const firebaseResponse = await this.userService.addNews({ ...this.form.value});
      const user = await firebaseResponse.get();
      let path = null;
      if (this.file) {
        path = await this.userService.uploadFile(`profile/${this.file.name}`, this.file);
        await this.userService.updateNews(user.id, {...user.data(), profilePicture: path ? path : this.img});
      }
      this.file = null;
      path = null;
      this.router.navigate(['/', 'news', 'new']);
    } else {
      console.log('El formulario es inválido');
    }
        this.router.navigate(['#']);
  }

  /**
   * Método que actualiza un usuario en firebase
   */
  async onUpdate(): Promise<void> {
    try {
      let path = null;
      if (this.file) {
        path = await this.userService.uploadFile(`profile/${this.file.name}`, this.file);
      }
      await this.userService.updateNews(this.params.NewId, {...this.form.value, profilePicture: path ? path : this.img});
      this.router.navigate(['/', 'news', 'principal']);
    } catch (error) {
      console.log(error);
    } finally {
      this.file = null;
    }
    this.router.navigate(['#']);
  }

  /**
   * Método que obtiene un archivo
   * @param event Evento para obtener el archivo seleccionado por el usuario
   */
  async onChange(event: any): Promise<any> {
    const files: any[] = event.target.files;
    if (files.length > 0) {
      this.file = files[0];
      this.img = await this.getBase64(files[0]);
      // const url = await this.userService.uploadFile(`profile/${files[0].name}`, files[0]);
      // this.img = url;
    } else {
      console.log('No selecciono un archivo');
    }
  }

  /**
   * Método que convierte un archivo a base64
   * @param file Archivo
   */
  getBase64(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


}
