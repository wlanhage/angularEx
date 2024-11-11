import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(@Inject(LoaderService) public loader: LoaderService) { }
}
