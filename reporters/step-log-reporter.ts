import fs from 'fs';
import path from 'path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';

type LogEntry = {
  order: number;
  test: TestCase;
  result: TestResult;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatFileTimestamp(date: Date): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function formatDisplayTime(date: Date): string {
  return date.toLocaleString('zh-CN', { hour12: false });
}

function stripAnsi(text: string): string {
  return text.replace(/\u001b\[[0-9;]*m/g, '');
}

function getProjectName(test: TestCase): string {
  let suite: Suite | undefined = test.parent;
  while (suite) {
    if (suite.type === 'project') {
      return suite.title;
    }
    suite = suite.parent;
  }
  return 'default';
}

function formatTitlePath(test: TestCase): string {
  const parts = test.titlePath().filter(
    (part) => part && !part.endsWith('.spec.ts') && part !== 'chromium' && part !== 'firefox' && part !== 'webkit',
  );
  return parts.join(' > ') || test.title;
}

function statusLabel(status: TestResult['status']): string {
  switch (status) {
    case 'passed':
      return '成功';
    case 'failed':
      return '失败';
    case 'timedOut':
      return '超时';
    case 'skipped':
      return '跳过';
    case 'interrupted':
      return '中断';
    default:
      return status;
  }
}

function statusIcon(status: TestResult['status']): string {
  switch (status) {
    case 'passed':
      return '[通过]';
    case 'skipped':
      return '[跳过]';
    default:
      return '[失败]';
  }
}

function shouldLogStep(step: TestStep): boolean {
  return ['pw:api', 'expect', 'test.step', 'assert'].includes(step.category);
}

function formatSteps(steps: TestStep[], indent = 1): string[] {
  const lines: string[] = [];

  for (const step of steps) {
    if (shouldLogStep(step)) {
      const mark = step.error ? '  ✗' : '  ▶';
      lines.push(`${'  '.repeat(indent)}${mark} ${step.title} (${step.duration}ms)`);
      if (step.error?.message) {
        lines.push(`${'  '.repeat(indent + 1)}错误: ${stripAnsi(step.error.message.split('\n')[0])}`);
      }
    }

    if (step.steps.length > 0) {
      lines.push(...formatSteps(step.steps, shouldLogStep(step) ? indent + 1 : indent));
    }
  }

  return lines;
}

function formatTestBlock(index: number, total: number, test: TestCase, result: TestResult): string {
  const relativeFile = path.relative(process.cwd(), test.location.file);
  const titlePath = formatTitlePath(test);
  const stepLines = formatSteps(result.steps);
  const lines = [
    '----------------------------------------------------------------',
    `${index}/${total} ${statusIcon(result.status)} ${titlePath}`,
    `文件: ${relativeFile}:${test.location.line}`,
    `项目: ${getProjectName(test)}`,
    '步骤:',
  ];

  if (stepLines.length > 0) {
    lines.push(...stepLines);
  } else {
    lines.push('  (无详细步骤)');
  }

  if (result.error && result.status !== 'passed') {
    lines.push(`  ✗ 失败原因: ${stripAnsi(result.error.message?.split('\n')[0] ?? '未知错误')}`);
  }

  lines.push(`结果: ${statusLabel(result.status)} | 耗时: ${result.duration}ms`);
  lines.push('');

  return lines.join('\n');
}

class StepLogReporter implements Reporter {
  private logPath = '';
  private startTime = new Date();
  private totalTests = 0;
  private orderMap = new Map<string, number>();
  private entries: LogEntry[] = [];
  private stats = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = new Date();
    const projectRoot = config.configFile ? path.dirname(config.configFile) : process.cwd();
    const logsDir = path.join(projectRoot, 'logs');
    fs.mkdirSync(logsDir, { recursive: true });
    this.logPath = path.join(logsDir, `${formatFileTimestamp(this.startTime)}.log`);

    const tests = suite.allTests();
    this.totalTests = tests.length;
    tests.forEach((test, index) => {
      this.orderMap.set(test.id, index);
    });

    const header = [
      '================================================================',
      'Playwright 测试执行日志',
      `开始时间: ${formatDisplayTime(this.startTime)}`,
      `用例总数: ${this.totalTests}`,
      '================================================================',
      '',
    ].join('\n');

    fs.writeFileSync(this.logPath, `\uFEFF${header}`, 'utf8');
    console.log(`\n日志文件: ${this.logPath}\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.entries.push({
      order: this.orderMap.get(test.id) ?? this.entries.length,
      test,
      result,
    });

    if (result.status === 'passed') {
      this.stats.passed += 1;
    } else if (result.status === 'skipped') {
      this.stats.skipped += 1;
    } else {
      this.stats.failed += 1;
    }
  }

  async onEnd(result: FullResult) {
    const endTime = new Date();
    const durationSec = ((endTime.getTime() - this.startTime.getTime()) / 1000).toFixed(1);
    const body = this.entries
      .sort((a, b) => a.order - b.order)
      .map((entry, index) => formatTestBlock(index + 1, this.totalTests, entry.test, entry.result))
      .join('\n');

    const summary = [
      '================================================================',
      '汇总',
      '================================================================',
      `结束时间: ${formatDisplayTime(endTime)}`,
      `总耗时: ${durationSec}s`,
      `通过: ${this.stats.passed}`,
      `失败: ${this.stats.failed}`,
      `跳过: ${this.stats.skipped}`,
      `最终结果: ${result.status === 'passed' ? '全部通过' : '存在失败'}`,
      `日志文件: ${this.logPath}`,
      '================================================================',
      '',
    ].join('\n');

    fs.appendFileSync(this.logPath, body + summary, 'utf8');
    console.log(`\n测试完成，日志已保存: ${this.logPath}\n`);
  }

  printsToStdio() {
    return false;
  }
}

export default StepLogReporter;
