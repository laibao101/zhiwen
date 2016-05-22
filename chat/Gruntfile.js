/**
 * Created by zhouhua on 2016/5/22.
 */
module.exports=function (grunt) {
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        cssmin:{
            options:{
                banner:'/*develop by zhouhua*/'
            },
            target:{
                files:[{
                    expand:true,
                    cwd:'src/css',
                    src:['*.css','!*.min.css'],
                    dest:'src/cssmin',
                    ext:'.min.css'
                }]
            }
        },
        uglify:{
            my_target: {
                files:[{
                    expand:true,
                    cwd:'src/js',
                    src:'**/*.js',
                    dest:'src/jsmin',
                    ext:'.min.js',
                    'src/jsmin/form.min.js': ['src/js/jquery.form.js']
                }]
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['cssmin','uglify']);
};