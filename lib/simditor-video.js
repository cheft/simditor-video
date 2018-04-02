Simditor.VideoButton = (function() {
  class VideoButton extends Simditor.Button {
    constructor(...args) {
      super(...args);
      if (this.editor.formatter._allowedAttributes.video === void 0) {
        this.editor.formatter._allowedAttributes.video = [];
      }
      this.editor.formatter._allowedAttributes.video.push('src', 'controls', 'poster');
    }

    _init(...args) {
      super._init(...args);
      return this.editor.body.on('click', 'video', (e) => {
        var $video;
        $video = $(e.currentTarget);
        this.popover.show($video);
        return false;
      });
    }

    render(...args) {
      super.render(...args);
      return this.popover = new Simditor.VideoPopover({
        button: this
      });
    }

    _status() {
      return this.popover.hide();
    }

    command() {
      var $newBlock, $video, range;
      range = this.editor.selection.range();
      this.editor.selection.range(range);
      $video = $('<video/>', {
        src: '',
        poster: 'img/simditor-default.svg',
        controls: 'controls',
        autoplay: 'autoplay',
        preload: 'none',
        width: 320,
        height: 240
      });

      $newBlock = $('<p/>').append($video);
      range.insertNode($newBlock[0]);
      this.editor.selection.setRangeAfter($video, range);
      this.editor.trigger('valuechanged');
      return $video.click();
    }

  };

  VideoButton.i18n = {
    'zh-CN': {
      videoLink: '视频链接',
      description: '支持 mp4、ogg、webm 格式'
    },
    'en-US': {
      videoLink: 'Video Link',
      description: 'Support mp4, ogg, webm format'
    }
  };

  VideoButton.prototype.name = 'video';

  VideoButton.prototype.icon = 'video';

  VideoButton.prototype.htmlTag = 'video';

  VideoButton.prototype.disableTag = 'pre, table';

  return VideoButton;

}).call(this);

Simditor.VideoPopover = class VideoPopover extends Simditor.Popover {
  render() {
    var tpl;
    tpl = `<div class="video-settings">\n  <div class="settings-field">\n    <label>${this._t('videoLink')}</label>\n    <input class="video-src" type="text"/>\n    <a class="btn-delete-video" href="javascript:;">\n      <i class="simditor-icon-delete"/>\n    </a>\n  </div>\n  <div class="settings-field">\n  ${this._t('description')}\n  </div>\n</div>`;
    this.el.addClass('video-popover').append(tpl);
    this.srcEl = this.el.find('.video-src');
    this.deleteEl = this.el.find('.btn-delete-video');
    this.srcEl.on('blur', (e) => {
      var val = this.srcEl.val();
      this.target.attr('src', val);
      return this.editor.inputManager.throttledValueChanged();
    });

    this.srcEl.on('keydown', (e) => {
      var range;
      if (e.which === 13 || e.which === 27) {
        e.preventDefault();
        range = document.createRange();
        this.editor.selection.setRangeAfter(this.target, range);
        this.hide();
        return this.editor.inputManager.throttledValueChanged();
      }
    });
    return this.deleteEl.on('click', (e) => {
      this.target.remove();
      if (this.$embed) {
        this.$embed.remove();
      }
      return this.hide();
    });
  }

  show(...args) {
    super.show(...args);
    this.srcEl.val(this.target.attr('src'));
    return this.srcEl.focus();
  }

};

Simditor.Toolbar.addButton(Simditor.VideoButton);
