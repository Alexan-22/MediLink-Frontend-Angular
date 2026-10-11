import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Medico } from '../../../core/models/medico.model';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss']
})
export class DoctorDetailComponent implements OnInit {

  medico?: Medico;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.doctorService
        .buscarPorId(+id)
        .subscribe(data => this.medico = data);

    }

  }

}
