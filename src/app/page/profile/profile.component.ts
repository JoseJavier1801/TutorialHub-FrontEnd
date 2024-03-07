import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ClassFormComponent } from '../../components/class-form/class-form.component';
import { CommonModule } from '@angular/common';
import { ClassCardComponentComponent } from '../../components/class-card-component/class-card-component.component';
import { ClassService } from '../../service/class.service';
import { MyProfileComponent } from '../../components/my-profile/my-profile.component';
import { TeacherProfileComponent } from '../../components/teacher-profile/teacher-profile.component';
import { UserService } from '../../service/user.service';
import { LoginComponent } from '../login/login.component';
import { Subscription, map, mergeMap, toArray } from 'rxjs';
import { teacher } from '../../model/teacher';
import { TeacherService } from '../../service/teacher.service';
import { client } from '../../model/client';
import { Class } from 'leaflet';
import { EditFormComponent } from '../../components/edit-form/edit-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ClassFormComponent, CommonModule, ClassCardComponentComponent, MyProfileComponent, TeacherProfileComponent, EditFormComponent,],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  showClassForm: boolean = false;
  classes: any[] = [];
  isTeacher: boolean = LoginComponent.isTeacher; // Utilizar la variable estática isTeacher del LoginComponent

  private teacherProfileUpdatedSubscription: Subscription | undefined;


  constructor(private classService: ClassService, private userService: UserService, private teacherService: TeacherService) { }
/**
 * Funcion para cargar las clases y mostrarlas en el componente 
 */
  ngOnInit(): void {
    this.load();
  }
/**
 * Funcion para cargar las clases y mostrarlas en el componente 
 */
  load() {
    const teacherId = LoginComponent.userId;
    if (teacherId !== null) { // Verifica que teacherId no sea nulo
      this.classService.getClassesByTeacherId(teacherId).pipe(
        mergeMap((details: any) => Object.values(details)),
        map((detail: any) => ({
          id: +detail.id,
          teacherId: +detail.teacherId,
          description: detail.description,
          type: detail.type,
          category: detail.category,
          location: { lat: +detail.lat, lng: +detail.lng },
          direction: detail.direction,
          postalCode: detail.postalCode,
          province: detail.province,
          duration: detail.duration,
          localidad: detail.localidad,
          photo: detail.photo,
          teacher: detail.teacher
        })),
        toArray() // Convertimos el flujo de objetos en un arreglo de objetos
      ).subscribe(
        (classes: Class[]) => {
          this.classes = classes;
        },
        (error) => {
          console.error('Error al cargar las clases:', error);
        }
      );
    } else {
      console.error('teacherId es nulo.');
    }
  }

/**
 * Funcion para cerrar el popup 
 */
  ngOnDestroy(): void {
    if (this.teacherProfileUpdatedSubscription) {
      this.teacherProfileUpdatedSubscription.unsubscribe();
    }
  }
/**
 * Funcion para abrir el popup 
 */
  openClassFormDialog(): void {
    this.showClassForm = true;
  }
  /**
   * Funcion para cerrar el popup 
   */

  closeClassFormDialog(): void {
    this.showClassForm = false;
  }
/**
 *  Funcion para agregar una nueva clase en el backend
 * @param newClass 
 */
  addClass(newClass: any): void {
    this.classService.addClass(newClass).subscribe(() => {
      this.refreshClasses();
    });
  }

 

/**
 * Funcion para refrescar las clases 
 */
  private refreshClasses(): void {
    this.classService.getClasses().subscribe(
      (classes: any[]) => {
        this.classes = classes;
      },
      (error) => {
        console.error('Error al obtener clases:', error);
      }
    );
  }

 
}
