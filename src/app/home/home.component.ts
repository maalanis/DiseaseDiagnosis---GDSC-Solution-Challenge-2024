import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FirestoreDataService } from '../../firestore-data.service'; // Adjust the import path as necessary
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerDialogComponent } from '../disclaimer-dialog/disclaimer-dialog.component'; // Adjust the path as necessary
import { map, startWith, catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router
import { combineLatest, Observable, of } from 'rxjs';
import { DiseaseInfoService } from '../services/disease-info.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  selectedSymptoms: string[] = [];
  symptomsControl = new FormControl();
  allSymptoms: string[] = [];
  availableSymptoms: string[] = [];
  diseaseInfo: any = null;

  highestDisease: { name: string, value: number } | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private firestoreDataService: FirestoreDataService,
    public dialog: MatDialog,
    private router: Router, // Inject the Router
    private diseaseInfoService: DiseaseInfoService,
  ) {}

  isLoadingDiseaseInfo = false;


  ngOnInit() {
    this.openDisclaimerDialog();
    this.firestoreDataService.getAllSymptomsValues().subscribe(symptoms => {
      this.allSymptoms = symptoms;
      this.availableSymptoms = [...this.allSymptoms];
      this.updateFilteredSymptoms();
    });

    this.updateFilteredSymptoms();
  }

  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  updateFilteredSymptoms() {
    this.symptomsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterAvailableSymptoms(value))
      )
      .subscribe(filtered => (this.availableSymptoms = filtered));
  }

  filterAvailableSymptoms(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSymptoms.filter(
      symptom => symptom.toLowerCase().includes(filterValue) && !this.selectedSymptoms.includes(symptom)
    );
  }

  onSymptomSelect(symptom: string) {
    this.selectedSymptoms.push(symptom);
    this.availableSymptoms = this.availableSymptoms.filter(s => s !== symptom);
    this.symptomsControl.setValue('');
  }

  removeSymptom(index: number) {
    const symptomToRemove = this.selectedSymptoms[index];
    this.selectedSymptoms.splice(index, 1);
    this.availableSymptoms.push(symptomToRemove);
  }

  // Placeholder for your calculate method
  calculate() {
    // Implement your calculate method here
    console.log('Calculate method called');
    this.updateHighestDisease();
  }

  clear() {
    // Implement any clear functionality here
  }

  openDisclaimerDialog(): void {
    const dialogRef = this.dialog.open(DisclaimerDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // No need to check the result if you always want to close the dialog
      // Navigate to the home screen or another route as needed
      console.log('Dialog closed with result:', result);

      this.router.navigate(['/']); // Adjust this to your home route
    });
  }




  // Assuming collectionProportions is an object with the calculated proportions
// for each disease, e.g., { symptomsCOVID: 0.5, symptomsCold: 0.3, symptomsFlu: 0.7 }
updateHighestDisease() {
  console.log('updateHighestDisease method called');
  // Use combineLatest to react to the latest emissions from each observable
  combineLatest({
    symptomsCOVID: this.calculateProportion('symptomsCOVID'),
    symptomsCold: this.calculateProportion('symptomsCold'),
    symptomsFlu: this.calculateProportion('symptomsFlu')
  }).subscribe(proportions => {
    console.log('Received proportions:', proportions); // This will show us the latest proportions

    let highestValue = 0;
    let highestDiseaseName = '';

    Object.entries(proportions).forEach(([disease, value]) => {
      console.log(`${disease} proportion value:`, value); // Log the value for each disease
      if (value > highestValue) {
        console.log('Updating highest value with disease ' + disease + ' and value ' + value);
        highestValue = value;
        highestDiseaseName = disease.replace('symptoms', ''); // Adjust for display
      }
    });

    this.highestDisease = { name: highestDiseaseName, value: highestValue };
    console.log(`Highest Disease set: ${this.highestDisease.name} with a proportion of ${this.highestDisease.value}`);

    if (this.highestDisease && this.highestDisease.name) {
      this.fetchDiseaseInfo(this.highestDisease.name);
    }
  });
}


  fetchDiseaseInfo(diseaseName: string) {
    this.isLoadingDiseaseInfo = true;
    this.diseaseInfoService.getDiseaseInfo(diseaseName).subscribe(data => {
      // Assuming data.text is your Markdown content
      this.diseaseInfo = data.text; // Directly store the Markdown string
      this.isLoadingDiseaseInfo = false;
    }, error => {
      console.error('Failed to fetch disease information:', error);
      this.isLoadingDiseaseInfo = false;
    });
  }




// This method should return the proportion of selected symptoms for a given disease collection
calculateProportion(diseaseCollection: string): Observable<number> {
  console.log('CalculateProportion method called for ' + diseaseCollection);
  return this.firestoreDataService.getSymptomsFromCollection(diseaseCollection).pipe(
    map(data => {
      const matches = this.selectedSymptoms.filter(symptom => data.symptoms.includes(symptom)).length;
      return matches / data.count; // Assuming 'count' is the total number of symptoms in the collection
    }),
    catchError(error => {
      console.error('Error calculating proportion for', diseaseCollection, error);
      return of(0); // Return an observable with 0 in case of error
    })
  );
}



// Make sure to call updateHighestDisease() at the appropriate place in your code,
// such as after you've completed calculating the proportions for each disease.

}
