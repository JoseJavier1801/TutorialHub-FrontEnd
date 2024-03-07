import { Component, OnInit } from '@angular/core';
import { ClassFormComponent } from '../../components/class-form/class-form.component';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../service/class.service';
import { ClassCardComponentComponent } from '../../components/class-card-component/class-card-component.component';
import { PetitionComponent } from '../../components/petition/petition.component';
import { Class } from '../../model/class'; // Asegúrate de importar la clase correcta
import { Observable, map,firstValueFrom, flatMap, toArray, mergeMap, tap } from 'rxjs';
import { Console } from 'console';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [ClassFormComponent, CommonModule, ClassCardComponentComponent, ],
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  classes!: Observable<Class[]>;

  constructor(private classService: ClassService) { }
/**
 * Función para cargar las clases y mostrarlas en el componente 
 */
  ngOnInit() {
    this.load();
  }
/**
 * Función para cargar las clases y mostrarlas en el componente 
 */

  load() {
    this.classes = this.classService.getAllClassroomDetails().pipe(
      mergeMap((details: any) => Object.values(details)),
      // Utilizamos flatMap para transformar directamente en un arreglo de clases
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
    );
  }

/**
 *  Función para mapear los detalles de la clase a la clase Class 
 * @param detail 
 * @returns  
 */

  // Función para mapear los detalles de la clase a la clase Class
  private mapToClass(detail: any): Class {
    
    return {
      id: detail.id,
      teacherId: detail.teacherId,
      description: detail.description,
      type: detail.type,
      category: detail.category,
      location: detail.location ? { lat: detail.location.lat, lng: detail.location.lng } : null,
      direction: detail.direction,
      postalCode: detail.postalCode,
      province: detail.province,
      duration: detail.duration,
      localidad: detail.localidad,
      photo: detail.photo,
      teacher: detail.teacher
      
    };
  }


  // Modifica la función para agregar una nueva clase
  async addClass(newClass: Class): Promise<void> {
    await firstValueFrom(this.classService.addClass(newClass));
    this.load();
    
  }
}