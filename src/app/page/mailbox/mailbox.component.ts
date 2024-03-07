import { Component, OnInit } from '@angular/core';
import { PetitionListComponent } from '../../components/petition-list/petition-list.component';
import { CommonModule } from '@angular/common';
import { Petition } from '../../model/petition';
import { PetitionService } from '../../service/petition.service';
import { PetitionComponent } from '../../components/petition/petition.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-mailbox',
  standalone: true,
  imports: [PetitionListComponent, CommonModule, PetitionComponent],
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.css']
})
export class MailboxComponent implements OnInit {
  petitions: Petition[] = [];

  constructor(private petitionService: PetitionService) { }
/**
 * Funcion para obtener las peticiones de la base de datos y mostrarlas en el componente 
 */
  ngOnInit(): void {
    const userId = LoginComponent.userId;
    const isTeacher = LoginComponent.isTeacher;

    if (userId !== null) {
      if (isTeacher) {
        this.petitionService.getPetitionsByTeacher(userId).subscribe((petitions: Petition[]) => { // Aquí se especifica el tipo de 'petitions'
          this.petitions = petitions;
          
        });
      } else {
        this.petitionService.getPetitionsByClientId(userId).subscribe((petitions: Petition[]) => { // Aquí se especifica el tipo de 'petitions'
          this.petitions = petitions;
          
        });
      }
    }
  }
}