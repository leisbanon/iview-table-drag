let util = {

};
util.title = function (title) {
    title = title ? title + ' - Home' : 'iView Table Component Drag';
    window.document.title = title;
};

export default util;