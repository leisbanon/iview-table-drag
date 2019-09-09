/**
 * @author GuanQun
 * @description Iview Talbe Component Customze Drag Plugin.
 * 使用导向：全局或局部直接引入该JS并调用导出的方法。需要注意是，加载自定义插件，必须是在下次DOM更新循环之后延时执行调用。this.$nextTick(() => {setTimeout...})
 * Tip：使Iview Table Component不在加载拖拽拉伸的行为，见下源码只需要在设置Table组件的类名为“NO-DRAG” => <Table class="NO-DRAG">...</Table>
 */
let install = {
    _onmousedown:false, // 鼠标按键是否被按下
    _onmousemove:false, // 鼠标是否发生移动

    _downClientX:null, // 鼠标按下时X轴坐标
    _moveClientX:null, // 鼠标移动时X轴坐标

    completeMoveDistance:null, // 实际拖动完成计算宽度

    dragTableItems:{
        warpper:null, // 当前正在执行操作的表格节点
        column:[], // 表格列
        baseline:null, // 列拖动标识基准线

        dragBlockIndex:null, // 当前拖动Table 的标快位置，用于定位当前拖动Column
        warpperPosition:{}, // 当前Table 内容相对于视图的位置信息
    },
    // 初始化Table Drag 应用
    init() {
        let ivuTableWrapper = document.querySelectorAll('.ivu-table-wrapper');
        for(let tableWarp of ivuTableWrapper) {
            let className = tableWarp.getAttribute('class');
            if(className.indexOf('NO-DRAG') == -1) {
                this.createTableMarkLine(tableWarp);
                this.createTableHeaderDragMark(tableWarp);

                // add mousedown listener
                let dragLine = tableWarp.querySelectorAll('.drag-markline');
                for(let element of dragLine) {
                    element.addEventListener('mousedown',this.onMouseDown.bind(this),false);
                }
            }
        }
    },
    /**
     * 鼠标按下
     * @param {Element} dragLine Table drag block sign
     * @param {Number} index then drag column index
     */
    onMouseDown(e) {
        let then = install;
        console.log('onmousedown...');
        then._onmousedown = true;
        then._downClientX = e.clientX;

        let getTableWarp = (node) => {
            let className = node.getAttribute('class');
            if(className && className.indexOf('ivu-table-wrapper') != -1) {
                // trigger get table necessary params
                then.dragTableItems.warpper = node;
                then.dragTableItems.column = node.querySelectorAll('.ivu-table-header table tr th');
                then.dragTableItems.baseline = node.querySelector('.drag-baseline');
                then.dragTableItems.dragBlockIndex = Number.parseInt(e.target.getAttribute('index'));
                then.dragTableItems.warpperPosition = node.getBoundingClientRect();

                // add document mouse listener
                then._addEventListener();
            }else {
                getTableWarp(node.parentNode);
            }
        }
        getTableWarp(e.target);
    },
    // 鼠标移动
    onMouseMove(e) {
        let then = install;
        if(!then._onmousedown) { return };
        e.preventDefault();

        then._onmousemove = true;
        then._moveClientX = e.clientX;

        // set element style
        let baseline = then.dragTableItems.baseline;
        let zIndex = baseline.style.zIndex;
        if(zIndex == -100) {
            baseline.style.zIndex = 'initial';
        }

        let docCursor = document.body.style.cursor;
        if(docCursor == 'initial') {
            document.body.style.cursor = 'col-resize';
        }

        // then drag distance
        let moveDistance = then._moveClientX - then._downClientX;
        // get current drag column distantce
        let columnWidth = then.dragTableItems.column[then.dragTableItems.dragBlockIndex].getBoundingClientRect().width;

        then.completeMoveDistance = moveDistance + columnWidth <= 55 ? 55 : moveDistance + columnWidth;

        // console.log('moveDistance => ' + moveDistance);
        // console.log('columnWidth => ' + columnWidth);
        // console.log('completeMoveDistance => ' + then.completeMoveDistance);

        if(then.completeMoveDistance == 55) { return; }

        // set distance right min space
        let position = then.dragTableItems.warpperPosition;
        let moveLeftPixel = (e.clientX) - (position.left);
        let moveRightPixel = (e.clientX) - (position.right);

        if(Math.abs(moveRightPixel) <= 55) {
            let left = position['right'] - position['left'] - 55 - 10;
            baseline.style.left = left;
            return;
        }
        baseline.style.left = moveLeftPixel + 'px';
    },
    // 鼠标释放
    onMouseUp(e) {
        let then = install;
        if(!then._onmousedown) { return };
        console.log('onmouseup...');

        // set element style
        then.dragTableItems.baseline.style.zIndex = -100;
        document.body.style.cursor = 'initial';

        if(then.completeMoveDistance) {
            // mouse loosen`set table column width
            let {warpper,dragBlockIndex} = then.dragTableItems;
            let colHeader = warpper.querySelectorAll('.ivu-table-header table colgroup col');
            colHeader[dragBlockIndex].setAttribute('width',then.completeMoveDistance + 5);

            let colBody = warpper.querySelectorAll('.ivu-table-body table colgroup col');
            colBody[dragBlockIndex].setAttribute('width',then.completeMoveDistance + 5);


            // then drag move distance
            let moveDistance = then._moveClientX - then._downClientX;
            // table container widtg
            let tableWarpWidth = warpper.getBoundingClientRect().width - 1;
            console.log('move size：' + moveDistance);

            // dynamic set table container width
            let setTableContrainerWidthAll = function(className) {
                warpper.querySelector('.ivu-table-body').style.overflowX = 'auto';
                let nodeWidth = warpper.querySelector(className[0]).style.width.replace('px','');

                for(let name of className) {
                    let count = Number.parseInt(nodeWidth) + moveDistance;
                    warpper.querySelector(name).style.width = count > tableWarpWidth ? (count + 'px') : (tableWarpWidth + 'px');
                }
            };
            setTableContrainerWidthAll([
                '.ivu-table-header table',
                '.ivu-table-body table',
                '.ivu-table-tip table tr td'
            ]);
        }
        
        // mouse loosen at init config pramas
        then._onmousedown = false;
        then._onmousemove = false;

        then._downClientX = null;
        then._moveClientX = null;

        then.completeMoveDistance = null;

        then._removeEventListener();
    },
    // 创建表格列拖动标快
    createTableHeaderDragMark(tableWarp) {
        let column = tableWarp.querySelectorAll('.ivu-table-header table tr th');
        for(let i = 0;i < column.length;i++) {
            let node = column[i];
            node.setAttribute('style','position: relative;overflow: initial;');
            
            // create mark lines
            let dragLine = document.createElement('div');
            dragLine.setAttribute('class',"drag-markline");
            dragLine.setAttribute('index',i);
            dragLine.setAttribute('style','opacity: 0;border: 6px #f00 solid;position: absolute;right: -6px;top: 0;bottom: 0;cursor: col-resize;z-index: 999;');

            let classname = node.getAttribute('class');
            if(i != (column.length - 1) && classname.indexOf('ivu-table-hidden') == -1) {
                node.appendChild(dragLine);
            }
        }
    },
    // 创建表格容器拖动 “基准线”
    createTableMarkLine(tableWarp) {
        let div = document.createElement('div');
        div.setAttribute('class','drag-baseline');
        div.setAttribute('style','z-index:-100;width: 10px;position: absolute;top: 0;bottom: 0;left: 0;');
        div.innerHTML = '<div style="border-right: 1px solid #CED2DA;position: absolute;left: 50%;height: 100%;"></div>';
        tableWarp.appendChild(div);
    },
    // 添加事件监听器. 鼠标按钮、移动、释放
    _addEventListener() {
        document.body.addEventListener('mousemove',this.onMouseMove,false);

        document.body.addEventListener('mouseup',this.onMouseUp,false);
    },
    // 删除事件监听器. 鼠标按钮、移动、释放
    _removeEventListener() {
        document.body.removeEventListener('mousemove',this.onMouseMove);
        
        document.body.removeEventListener('mouseup',this.onMouseUp);
    },
};

export default function iviewTableDrag() {
    install.init();
}