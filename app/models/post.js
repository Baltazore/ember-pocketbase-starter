import Model, { attr } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') title;
  @attr body;
  @attr('datetime') created;
  @attr('datetime') updated;
  @attr('boolean') published;
}
