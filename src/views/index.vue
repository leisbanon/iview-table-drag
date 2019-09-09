<template>
    <div id="index">
        <Card>
            <p slot="title">Iview Table Drag Function</p>
            <Table 
                :columns="columns" 
                stripe
                border
                size="small"
                :data="data">
            </Table>
        </Card>
    </div>
</template>

<script>
    import iviewTableDrag from '../libs/iviewTableDrag'
    export default {
        data() {
            return {
                columns: [
                    {title: 'Name',key: 'name'},
                    {title: 'Age',key: 'age'},
                    {title: 'Address',key: 'address'},
                    {title: 'Emaill',key: 'emaill'},
                    {title: 'Phone',key: 'phone'},
                    {title: 'Time',key: 'time'},
                    {title: 'Remarks',key: 'remarks'},
                ],
                data: [
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                    {name: '小明',age: 18,address: '上海市青浦区金字芋路2千弄500室',emaill: '3131244726@qq.com',phone:'123456789',time:'2019-09-06 10:35 00',remarks:'无...',},
                ]
            }
        },
        created() {
            // 初始化设置表格默认配置项
            this.columns.forEach(v => {
                v['align'] = 'center';
                v['tooltip'] = true;
                v['minWidth'] = 100;
                v['sortable'] = true;
            });
        },
        mounted() {
            this.$nextTick(() => {
                setTimeout(() => {
                    iviewTableDrag();
                }, 1500);
            });
        },
        methods: {},
    }
</script>

<style lang="less" scoped>
    #index {
        margin: 100px 50px 50px 50px;
    }
</style>