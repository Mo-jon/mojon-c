#!/usr/bin/env node

const fs = require('fs');
// 命令回调解析
const program = require('commander');
// 下载插件 https://github.com/jprichardson/node-github-download
const ghdownload = require('github-download');
// 添加颜色
const chalk = require('chalk');
// 添加“勾、叉、警告”
const logSymbols = require('log-symbols');
// 加载效果
const ora = require('ora');
// 简写console.log
const log = console.log;
// 配置下载地址
const templates = {
    vue: {
        user: 'Mo-jon',
        repo: 'vue',
        ref: 'master'
    },
    react: {
        user: 'Mo-jon',
        repo: 'react',
        ref: 'master',
    },
    angular: {
        user: 'Mo-jon',
        repo: 'angular',
        ref: 'master',
    },
    webpack: {
        user: 'Mo-jon',
        repo: 'webpack',
        ref: 'master',
    }
};
// cli 名称
const cliName = 'mojon-c';


program
    .version('1.0.0', '-v, --version', '查看版本号')
    .helpOption('-h, --help', '查看帮助信息');

program
    .command('run [env]')
    .description('运行环境变量 -- 未实现')
    .option("-r, --run [mode]", "选择运行模式")
    .action(function (env, options) {
        const mode = options.setup_mode || 'development';
        env = env || '所有';
        log('添加"%s变量"到 %s 模式', env, mode);
    });

program
    .command('init <template> <project>')
    .description('创建项目')
    .action(function (template, project) {
        log('');
        log(logSymbols.info, chalk.blue(`创建 ${template} 项目, 名称 ${project}`));

        // 目录是否存在
        if (fs.existsSync(project)) {
            log(logSymbols.error, chalk.red(project + ' 已存在当前目录'));
            return;
        }

        // 模板是否存在
        if (templates[template] == undefined) {
            log(logSymbols.info, chalk.blue(`运行 ${cliName} list 查看所有模板`));
            console.error(logSymbols.error, chalk.red('模板不存在'));
            return;
        }

        // loading加载
        const spinner = ora('开始下载').start();
        spinner.color = 'yellow';
        spinner.text = '正在下载...';

        // 从git下载
        let error = false;
        ghdownload(templates[template], project)
            .on('error', function (err) {
                error = err;
            })
            .on('end', function () {
                // loading结束
                spinner.stop()

                // 提示结果
                if (error) {
                    console.error(chalk.red(error))
                } else {
                    log(logSymbols.success, chalk.green(`成功: ${process.cwd()}\\project`))
                }
            });
    }).on('--help', function () {
        log('');
        log('例如:');
        for (let index in templates) {
            log(`  ${cliName} init ${index} hello`);
            break;
        }
    });

program
    .command('list')
    .description('模板列表')
    .action(function () {
        log('')
        for (let index in templates) {
            log(`  ${chalk.blue(index)} 是一个${index}开发模板`);
        }
    }).on('--help', function () {
        log('');
        log(`  ${cliName} list 查看所有可用模板列表`);
    });

program
    .command('page <name>')
    .description('创建页面 -- 未实现')
    .action(function (name) {
        log('功能未实现');
    }).on('--help', function () {
        log('');
        log('例如:');
        log(`  ${cliName} page test`);
    });

program
    .command('components <name>')
    .description('创建组件 -- 未实现')
    .action(function (name) {
        log('功能未实现');
    }).on('--help', function () {
        log('');
        log('例如:');
        log(`  ${cliName} components test`);
    });

program.parse(process.argv);