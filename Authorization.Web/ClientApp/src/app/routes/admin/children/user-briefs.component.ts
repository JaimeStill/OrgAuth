import {
  Component,
  OnInit
} from '@angular/core';

import {
  BriefService,
  UserService
} from '../../../services';

import {
  Brief,
  User,
  UserBrief
} from '../../../models';

@Component({
  selector: 'user-briefs-route',
  templateUrl: 'user-briefs.component.html',
  providers: [BriefService]
})
export class UserBriefsComponent implements OnInit {
  user: User;
  uploading = false;

  constructor(
    public briefSvc: BriefService,
    public identity: UserService
  ) { }

  ngOnInit() {
    this.identity.getUsers();
  }

  selectUser = (user: User) => {
    this.user = user;
    this.briefSvc.getUserBriefs(user.id);
    this.briefSvc.getUserExcludedBriefs(user.id);
  }

  deselectUser = () => {
    this.user = null;
    this.briefSvc.clearBriefs();
    this.briefSvc.clearExcludedBriefs();
  }

  saveUserBriefs = async (b: Brief[]) => {
    this.uploading = true;

    const briefs = b.map(x => Object.assign({} as UserBrief, {
      briefId: x.id,
      userId: this.user.id
    }));

    const res = await this.briefSvc.saveUserBriefs(this.user.id, briefs);

    this.uploading = false;

    if (res) {
      this.briefSvc.getUserBriefs(this.user.id);
      this.briefSvc.getUserExcludedBriefs(this.user.id);
    }
  }
}
