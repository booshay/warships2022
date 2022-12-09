import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFirestore) { }

  getData(type, user) {
    return this.db.collection(`team/${user.uid}/${type}`).snapshotChanges().pipe(
      map(actions => actions.map((a: any) => {//remove the ':any' if there is an issue, i just added this to remove an error that wasn't affecting anything.
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        console.log(data);

        return { id, ...data };
      }))
    );
  }

  async editCoord(type, user, id, enhancement) {
    await this.db.collection(`team/${user.uid}/${type}`).doc(id).update({ enhanced: enhancement });
  }

  async deleteCoord(type, id, user) {
    await this.db.collection(`team/${user.uid}/${type}`).doc(id).delete();
    console.log('deleted');
  }

  async addCoord(type, coords, user) {
    await this.db.collection('team').doc(user.uid).collection(type).add(coords);
    console.log(coords, user.uid);
  }
}
