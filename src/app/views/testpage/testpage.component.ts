import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';


@Component({
  selector: 'app-testpage',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ],
  templateUrl: './testpage.component.html',
  styleUrl: './testpage.component.scss'
})
export class TestpageComponent {



}
