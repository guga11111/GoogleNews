import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { IUser } from 'src/app/Notice/notice.interface';
import { NoticiaService } from 'src/app/service/noticia.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
    News: IUser[];
    NewsObs: Subscription;
    isActive: boolean;

  constructor(
    private userService: NoticiaService,
    private router: Router,
  ) { }

  

  ngOnInit(): void {
    this.News = [];
    this.isActive = true;
    this.NewsObs = this.userService.getNewsFirebase().pipe(takeWhile(() => this.isActive)).subscribe((New: IUser[]) => {
      this.News = New;
      console.log(New);
    });
  }
  
  onUpdate(New: IUser): void {
    this.router.navigate(['/', 'news', 'new', + New._id]);
  }

  async onDelete(New: IUser): Promise<void> {
    try {
      const newDeleted = await this.userService.deleteNewById(New._id);
      console.log('Nota eliminado', newDeleted);
    } catch (error) {
      console.log('No se pudo eliminar la nota', error);
    }
  }
}
