import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../Notice/notice.interface';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
@Injectable({
  providedIn: 'root'
})
  users: IUser[] = [
    {
      id: 1,
      notice: 'omar.salas@jynsystems.com',
      subtitle: '123',
      profilePicture: 'teacher',
    },
    {
      id: 2,
      notice: 'andres@jynsystems.com',
      subtitle: '123',
      profilePicture: 'student',
    },
  ];
   private usersCollection: AngularFirestoreCollection<IUser>;

  constructor(
    // Para usar la clase HttpClient hay que agregar en el módulo el módulo de esta clase
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
  ) {
    this.usersCollection = angularFirestore.collection<IUser>('users');
  }
 
  
  getNewsFirebase(): Observable<IUser[]> {
    return this.usersCollection.valueChanges({idField: '_id'});
  }

  getNewById(id: string): Observable<firebase.firestore.DocumentSnapshot<IUser>> {
    return this.usersCollection.doc(id).get();
  }

  updateNews(id: string, teacher: IUser): Promise<void> {
    return this.usersCollection.doc(id).update(teacher);
  }

  addNews(user: IUser): Promise<DocumentReference<IUser>> {
    return this.usersCollection.add(user);
  }

  deleteNewById(id: string): Promise<void> {
    return this.usersCollection.doc(id).delete();
  }

  async uploadFile(path: string, data: any): Promise<any> {
    await this.angularFireStorage.upload(path, data); // (profile/my-file.png , archivo)
    return await this.angularFireStorage.ref(path).getDownloadURL().toPromise();
  }

}
