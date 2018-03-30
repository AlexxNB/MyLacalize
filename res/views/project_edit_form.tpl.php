<?php if($Project):?>

<?php else:?>
  <h3><?=$L['projects:form:header_add']?></h3>
<?php endif; ?>

<div class="form-group">
  <label class="form-label" for="title"><?=$L['projects:form:title_label']?></label>
  <input class="form-input" type="text" id="title" placeholder="<?=$L['projects:form:title']?>">
</div>

<div class="form-group">
  <label class="form-label" for="descr"><?=$L['projects:form:description_label']?></label>
  <textarea class="form-input" id="descr" placeholder="<?=$L['projects:form:description']?>" rows="3"></textarea>
</div>

<div class="form-group">
  <label class="form-switch">
    <input type="checkbox" id="public" data-pid="">
    <i class="form-icon"></i> <?=$L['projects:form:make_public']?> <span class="hide" id="public_descr"><?=$L['projects:form:public_descr']?></span>
  </label>
</div>

<div class="form-group hide" id="pl_container">
  <div class="input-group">
    <span class="input-group-addon"><?=$L['projects:form:public_link']?></span>
    <input type="text" class="form-input"  disabled="disabled" id="public_link">
    <button class="btn btn-primary input-group-btn" id="doCopyLink" data-ok="<?=$L['projects:form:msg:copy_ok']?>" data-err="<?=$L['projects:form:msg:copy_err']?>"><i class="icon-copy"></i> <?=$L['projects:form:copy_link']?></button>
  </div>
</div>

<div class="form-group text-center mt">
<?php if($Project):?>

<?php else:?>
  <button class="btn btn-primary" id="doCreateProject"><i class="icon-add"></i> <?=$L['projects:form:create_button']?></button>
<?php endif; ?>
</div>