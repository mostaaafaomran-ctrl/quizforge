import { QuizSet } from './types';

export const DEMO_SET: QuizSet = {
  title: 'Sample: Introduction to Operating Systems',
  sourceName: 'OS-Lecture-1.pdf',
  items: [
    {
      kind: 'mcq',
      question: 'What is the main role of an operating system?',
      options: [
        'Manage hardware and software resources',
        'Compile programs',
        'Design user interfaces',
        'Connect computers to the internet',
      ],
      answerIndex: 0,
      explanation: 'The OS manages CPU, memory, devices and applications.',
    },
    {
      kind: 'mcq',
      question: 'ما الفرق بين الـ Process والـ Program؟',
      options: [
        'البرنامج ملف مخزن، والعملية برنامج قيد التنفيذ',
        'لا فرق بينهما',
        'العملية أصغر من البرنامج',
        'البرنامج يعمل في الذاكرة فقط',
      ],
      answerIndex: 0,
      explanation: 'العملية (Process) هي نسخة نشطة من البرنامج أثناء التشغيل.',
    },
    {
      kind: 'mcq',
      question: 'Which scheduling algorithm can cause starvation?',
      options: ['First Come First Served', 'Round Robin', 'Shortest Job First', 'Multilevel Feedback Queue'],
      answerIndex: 2,
      explanation: 'SJF favors short jobs, so long jobs may wait indefinitely.',
    },
    {
      kind: 'mcq',
      question: 'ما هي حالات العملية (Process States) الأساسية؟',
      options: [
        'New, Ready, Running, Waiting, Terminated',
        'Start, Stop, Pause',
        'Open, Read, Write, Close',
        'Input, Process, Output',
      ],
      answerIndex: 0,
      explanation: 'الحالات الخمس: جديدة، جاهزة، تعمل، منتظرة، منتهية.',
    },
    { kind: 'card', front: 'What is a context switch?', back: 'Saving the state of one process and loading another so the CPU can switch between them.' },
    { kind: 'card', front: 'ما هو الـ Deadlock؟', back: 'حالة تتوقف فيها مجموعة عمليات لأن كل واحدة تنتظر موردًا تمتلكه عملية أخرى.' },
    { kind: 'card', front: 'Name the four conditions required for deadlock.', back: 'Mutual exclusion, hold and wait, no preemption, circular wait.' },
    { kind: 'card', front: 'ما وظيفة الـ Scheduler؟', back: 'يختار أي عملية تحصل على المعالج ومتى، لتحقيق استغلال عادل وفعال للـ CPU.' },
  ],
};
