import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
  ParamMap
} from '@angular/router';

@Component({
  selector: 'denied-route',
  templateUrl: 'denied.component.html'
})
export class DeniedComponent implements OnInit {
  loading = true;
  message = 'You are denied for unspecified reasons';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(async (param: ParamMap) => {
        if (param.has('message')) {
          this.message = param.get('message');
        }
        this.loading = false;
      });
  }
}
