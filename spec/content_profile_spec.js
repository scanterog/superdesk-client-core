var templates = require('./helpers/templates'),
    contentProfiles = require('./helpers/content_profiles'),
    monitoring = require('./helpers/monitoring'),
    workspace = require('./helpers/workspace'),
    authoring = require('./helpers/authoring'),
    assertToastMsg = require('./helpers/utils').assertToastMsg;

describe('Content profiles', () => {
    it('creates corresponding template', () => {
        // create a new content profile
        contentProfiles.openContentProfileSettings();
        contentProfiles.add();
        contentProfiles.getNameElement().sendKeys('Simple');
        contentProfiles.save();
        contentProfiles.toggleEnable();
        contentProfiles.disableField('Abstract');
        contentProfiles.update();
        templates.openTemplatesSettings();
        expect(templates.getListCount()).toEqual(2);
        templates.edit('Simple');
        expect(authoring.getAbstractFieldCount()).toEqual(0);
        expect(templates.getContentProfile()).toEqual('Simple');
        templates.cancel();

        // disable content profile displays warning
        contentProfiles.openContentProfileSettings();
        contentProfiles.edit('Simple');
        contentProfiles.toggleEnable();
        contentProfiles.update();
        assertToastMsg('error', 'Cannot disable content profile as following templates are referencing: simple');
        contentProfiles.cancel();

        // delete content profile and check the template
        contentProfiles.openContentProfileSettings();
        contentProfiles.delete('Simple');
        templates.openTemplatesSettings();
        expect(templates.getListCount()).toEqual(2);
        templates.edit('Simple');
        expect(authoring.getAbstractFieldCount()).toEqual(1);
        expect(templates.getContentProfile()).toEqual('');
        templates.cancel();
    });

    it('displays defined fields in authoring', () => {
        // create a new content profile
        contentProfiles.openContentProfileSettings();
        contentProfiles.add();
        contentProfiles.getNameElement().sendKeys('Simple');
        contentProfiles.save();
        contentProfiles.toggleEnable();
        contentProfiles.disableField('Abstract');
        contentProfiles.setRequired('Editorial Note');
        contentProfiles.update();
        monitoring.openMonitoring();
        workspace.selectDesk('Sports Desk');
        authoring.createTextItemFromTemplate();
        expect(authoring.getAbstractFieldCount()).toEqual(0);

        // publish of the required field will fail
        authoring.setHeaderSluglineText('Story1 slugline');
        authoring.getSubjectMetadataDropdownOpened();
        browser.sleep(100);
        browser.actions().sendKeys('archaeology')
        .perform();
        browser.actions().sendKeys(protractor.Key.DOWN)
        .perform();
        browser.actions().sendKeys(protractor.Key.ENTER)
        .perform();
        authoring.save();
        authoring.publish(true);
        assertToastMsg('error', 'EDNOTE is a required field');
    });
});
