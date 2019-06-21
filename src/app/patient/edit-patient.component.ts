import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from './patient.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Patient } from './patient.model';

@Component({
  selector: 'drp-patient-create',
  templateUrl: './edit-patient.component.html',
  styles: [`
    em { float: right; color: #E05C65; padding-left: 10px; }
    .error input { background-color: #E3C3C5; }
    .error ::-webkit-input-placeholder { color: #999; }
    .error ::-moz-placeholder { color: #999; }
    .error :-moz-placeholder { color: #999; }
    .error :ms-input-placeholder { color: #999; }
  `]
})
export class EditPatientComponent implements OnInit {
  patientId: string;
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  birthDate = new FormControl('', Validators.required);
  civicAddress = new FormControl('');
  municipality = new FormControl('');
  postalCode = new FormControl('', testPostalCode);
  form: FormGroup;
  saveError: string;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {
    this.form = fb.group({
      'firstName': this.firstName,
      'lastName': this.lastName,
      'birthDate': this.birthDate,
      'civicAddress': this.civicAddress,
      'municipality': this.municipality,
      'postalCode': this.postalCode
    });
  }

  ngOnInit() {
    this.route.data.forEach(data => {
      const patient = data['patient'];
      if (patient) {
        this.patientId = patient.id || '';
        this.firstName.setValue(patient.firstName || '');
        this.lastName.setValue(patient.lastName || '');
        this.birthDate.setValue(patient.birthDate || '');
        this.civicAddress.setValue(patient.civicAddress || '');
        this.municipality.setValue(patient.municipality || '');
        this.postalCode.setValue(patient.postalCode || '');
      } else {
        this.patientId = '';
      }
    });
  }

  savePatient(formValue) {
    const updatedPatient: Patient = {
      id: this.patientId,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthDate: formValue.birthDate,
      civicAddress: formValue.civicAddress,
      municipality: formValue.municipality,
      postalCode: formValue.postalCode
    };

    this.saveError = '';
    this.patientService.savePatient(updatedPatient).subscribe((patient: Patient) => {
      this.router.navigate(['/patients', patient.id]);
    }, (error: Error) => {
      this.saveError = error.message;
    });
  }

  cancel() {
    this.router.navigate(['/patients']);
  }
}

/**
 * Test Postal Code
 *
 * This function uses Regex pattern to match the postal code record of the patient
 * to see if it is valid or not. This also returns null if the text is empty, as this
 * function is not responsible for the "required" condition of the form.
 *
 * RegEx Reference: http://regexlib.com/Search.aspx?k=canadian+postal+code&AspxAutoDetectCookieSupport=1
 *
 * @param toTest The Form Control to test
 * @return object Either null or an object containing the object that will tell the Form Control that it is invalid
 */
function testPostalCode(toTest: FormControl): object {
  if(toTest.value.length > 0) {
    return RegExp(/^$|^\d{5}-\d{4}|\d{5}|[A-Z]\d[A-Z] \d[A-Z]\d$/).test(toTest.value) ? null : { invalidPostalCode: { value: toTest.value }};
  }
  return null;
}