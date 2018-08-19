/**
 *  @file       Level4ReadyAnimationController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LevelReadyAnimation from './LevelReadyAnimation';
import ControllerWithStore from './ControllerWithStore';

class Level4ReadyAnimationController extends ControllerWithStore {
  init () {
    this.level4Ready = null;
    this.animation = new LevelReadyAnimation(
      this.store,
      Object.assign({}, this.params, {
        levelId: 'level_4'
      })
    );
  }

  handle_state_change () {
    let state = this.store.getState();
    let level4Ready = state.level4Ready;

    if (level4Ready !== this.level4Ready) {
      console.log("level4Ready");
      console.log(level4Ready);
      if (level4Ready) {
        setTimeout(() => {
          this.animation.start()
        }, 8 / state.tempo * 60000.0);
      } else {
        this.animation.stop();
      }
      this.level4Ready = level4Ready;
    }
  }
}

export default Level4ReadyAnimationController;
