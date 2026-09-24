/* Shared by the public site (script.js) and the admin (admin.js).
   1. DEFAULTS  = the text shown until something is saved in Firebase. Every text is {ar, fr, en}.
   2. SCHEMA    = which fields the admin lets you edit ("plain" fields are not translated).
   3. UI        = fixed interface words (buttons, labels) in the three languages.
   4. Firebase setup + loader. */
window.BR = (function () {
  var LANGS = ['ar', 'fr', 'en'];
  function T(ar, fr, en) { return { ar: ar, fr: fr, en: en }; }
  function same(x) { return T(x, x, x); }

  var D = {
    hero: {
      kicker: T('مدرسة خاصة بوجدة · العربية والفرنسية والإنجليزية', 'École privée à Oujda · Arabe, français et anglais', 'Private school in Oujda · Arabic, French & English'),
      title: T('ادخل مدرسةً تعرف كل طفلٍ باسمه.', 'Entrez dans une école qui connaît chaque enfant par son prénom.', 'Enter a school that knows every child by name.'),
      lede: T('باب الريان مدرسة خاصة بوجدة للتعليم الأولي والابتدائي. أقسام صغيرة، ومعلمون أكفاء، ورسوم في المتناول، وطفلٌ يُعرف باسمه.',
              'Bab Rrayan est une école privée à Oujda, du préscolaire au primaire. Des classes à petit effectif, des enseignants compétents, des frais accessibles et un enfant connu par son prénom.',
              'Bab Rrayan is a private preschool and primary school in Oujda. Small classes, skilled teachers, fair fees, and a child who is known by name.'),
      cta: T('احجز زيارة', 'Réserver une visite', 'Book a visit'),
      facts: [
        { label: T('الأسلاك', 'Cycles', 'Cycles'), value: same('2') },
        { label: T('اليوم الدراسي', 'Journée d’école', 'School day'), value: same('08:30 – 14:30') },
        { label: T('اللغات', 'Langues', 'Languages'), value: same('3') },
        { label: T('التلاميذ في القسم', 'Élèves par classe', 'Class size'), value: T('18 كحد أقصى', '18 maximum', '18 max') }
      ]
    },
    about: {
      big: T('الباب أصغر بناءٍ يغيّر كل شيء في المكان الذي تقف فيه. ونحن نؤمن أن المدرسة يجب أن تفعل الشيء نفسه مع الطفل، وبرفق.',
             'Une porte est la plus petite construction qui change tout à l’endroit où l’on se tient. Nous pensons que l’école doit faire la même chose pour un enfant, avec douceur.',
             'A gate is the smallest building that changes everything about where you are standing. We think school should do the same for a child, and do it gently.'),
      p1: T('باب الريان مدرسة خاصة بوجدة تضم سلكين فقط: التعليم الأولي والابتدائي. نحن بناية واحدة وفريق صغير، وهذا هو المقصود: كل معلم يعرف كل طفل، وكل أب يعرف بمن يتصل.',
            'Bab Rrayan est une école privée à Oujda qui compte deux cycles seulement : le préscolaire et le primaire. Un seul bâtiment, une petite équipe, et c’est voulu : chaque enseignant connaît chaque enfant, et chaque parent sait qui appeler.',
            'Bab Rrayan is a private school in Oujda with just two cycles: preschool and primary. One building and a small team, and that is the point: every teacher knows every child, and every parent knows who to call.'),
      p2: T('تُدرَّس المواد بالعربية والفرنسية منذ السنة الأولى، وتُضاف الإنجليزية عند سن السابعة. يغادرنا التلاميذ وهم يقرؤون بثقة باللغات الثلاث.',
            'Les cours se font en arabe et en français dès la première année, avec l’anglais à partir de sept ans. Nos élèves nous quittent en lisant avec assurance dans les trois langues.',
            'Lessons run in Arabic and French from the first year, with English added at seven. Children leave us reading confidently in all three.'),
      ticks: [
        { text: T('سلكان تحت سقف واحد: الأولي والابتدائي', 'Deux cycles sous un même toit : préscolaire et primaire', 'Two cycles under one roof: preschool and primary') },
        { text: T('المنهاج الوطني المغربي، بالعربية والفرنسية والإنجليزية', 'Programme national marocain, en arabe, français et anglais', 'Moroccan national curriculum, in Arabic, French and English') },
        { text: T('أقسام صغيرة حتى لا يضيع أي طفل', 'Petites classes pour que personne ne se perde', 'Small classes, so no child gets lost') },
        { text: T('تقارير واضحة وأبواب مفتوحة للأسر', 'Des bulletins clairs et une porte toujours ouverte aux parents', 'Clear reports and an open door for parents') }
      ]
    },
    stages: {
      big: T('سلكان، وفريق واحد يهتم بطفلكم: من أول يوم في التعليم الأولي إلى نهاية الابتدائي.',
             'Deux cycles, une seule équipe attentive : du premier jour de maternelle à la fin du primaire.',
             'Two cycles, one caring team: from the first day of preschool to the end of primary.'),
      items: [
        { name: T('التعليم الأولي', 'Maternelle', 'Preschool'), ages: T('من 3 إلى 5 سنوات', '3 à 5 ans', 'Ages 3–5'),
          desc: T('تعلّم باللعب والأناشيد والحكايات، في قاعة هادئة مع معلمة تعرف اسم طفلكم وعاداته.',
                  'Apprendre par le jeu, les chansons et les histoires, dans une salle calme, avec une enseignante qui connaît le prénom et les habitudes de votre enfant.',
                  'Learning through play, songs and stories, in a calm room with a teacher who knows your child’s name and habits.'),
          langs: T('العربية · الفرنسية', 'Arabe · Français', 'Arabic · French') },
        { name: T('الابتدائي', 'Primaire', 'Primary'), ages: T('من السنة الأولى إلى السادسة · 6 إلى 11 سنة', '1re à 6e année · 6 à 11 ans', '1st–6th year · ages 6–11'),
          desc: T('أساس متين في القراءة والكتابة والحساب، بالعربية والفرنسية والإنجليزية، مع تحضير دقيق لامتحان نهاية الابتدائي والانتقال إلى الإعدادي.',
                  'De solides bases en lecture, écriture et calcul, en arabe, français et anglais, avec une préparation soignée à l’examen de fin de primaire et au passage au collège.',
                  'Solid basics in reading, writing and maths, in Arabic, French and English, with careful preparation for the end-of-primary exam and the move to collège.'),
          langs: T('العربية · الفرنسية · الإنجليزية', 'Arabe · Français · Anglais', 'Arabic · French · English') }
      ]
    },
    day: {
      big: T('من 08:30 إلى 14:30، يوم هادئ ومنظَّم.', 'De 8h30 à 14h30, une journée calme et bien organisée.', 'From 08:30 to 14:30, calm and well organised.'),
      items: [
        { time: '08:30', title: T('الاستقبال', 'Accueil', 'Welcome'), text: T('يصل الأطفال وتبدأ الحصة بدقائق هادئة داخل القسم.', 'Les enfants arrivent et la journée commence par quelques minutes calmes en classe.', 'Children arrive and the day starts with a few calm minutes in class.') },
        { time: '09:00', title: T('حصص الصباح', 'Cours du matin', 'Morning lessons'), text: T('عربية وفرنسية ورياضيات، في حصص قصيرة.', 'Arabe, français et mathématiques, en séquences courtes.', 'Arabic, French and mathematics, in short blocks.') },
        { time: '10:30', title: T('الاستراحة', 'Récréation', 'Recess'), text: T('وقت للّعب وتناول وجبة خفيفة.', 'Un temps pour jouer et prendre une collation.', 'A break to play and have a snack.') },
        { time: '11:00', title: T('اكتشاف وقراءة', 'Éveil et lecture', 'Discovery and reading'), text: T('اكتشاف العالم من حولنا وحلقات القراءة.', 'Découvrir le monde qui nous entoure, et temps de lecture.', 'Discovering the world around us, and reading time.') },
        { time: '12:15', title: T('استراحة الغداء', 'Pause déjeuner', 'Lunch break'), text: T('وقت للأكل والراحة.', 'Un temps pour manger et se reposer.', 'Time to eat and rest.') },
        { time: '13:00', title: T('حصص ما بعد الزوال', 'Cours de l’après-midi', 'Afternoon lessons'), text: T('الإنجليزية والرسم وألعاب الحركة.', 'Anglais, dessin et jeux de mouvement.', 'English, drawing and movement games.') },
        { time: '14:30', title: T('نهاية اليوم', 'Fin de journée', 'Home time'), text: T('يُسلَّم كل طفل لولي أمره عند الباب.', 'Chaque enfant est remis à ses parents à la porte.', 'Each child is handed to a parent at the door.') }
      ]
    },
    why: {
      big: T('معلمون جيدون، ورسوم عادلة، ومدرسة لا يكون فيها طفلكم مجرد رقم.',
             'De bons enseignants, des frais justes, et une école où votre enfant n’est jamais un numéro.',
             'Good teachers, fair fees, and a school where your child is never a number.'),
      items: [
        { title: T('معلمون يُوثق بهم', 'Des enseignants de confiance', 'Teachers you can trust'),
          text: T('كل معلم عندنا مؤهَّل وذو خبرة، ويُختار لصبره مع الصغار. يتابعون تكويناً منتظماً، ويشتغلون فريقاً واحداً، ويتحدثون مع الأسر بصراحة.',
                  'Chaque enseignant est qualifié, expérimenté et choisi pour sa patience avec les petits. Ils suivent des formations régulières, travaillent en équipe et parlent franchement aux familles.',
                  'Every teacher is qualified, experienced and chosen for patience with young children. They train regularly, work as one team and speak openly with families.') },
        { title: T('رسوم معقولة', 'Des frais justes', 'Fees that make sense'),
          text: T('رسومنا من أنسب الرسوم بين المدارس الخاصة بوجدة، وواضحة منذ اليوم الأول دون مصاريف خفية. اسألوا الإدارة عن لائحة الرسوم الحالية.',
                  'Nos frais figurent parmi les plus raisonnables des écoles privées d’Oujda, clairs dès le premier jour, sans supplément caché. Demandez la grille actuelle au secrétariat.',
                  'Our fees are among the most reasonable for a private school in Oujda, clear from day one with no hidden extras. Ask the office for the current fee list.') },
        { title: T('أقسام صغيرة', 'Des petites classes', 'Small classes'),
          text: T('حين يكون القسم صغيراً، يلاحظ المعلم أن طفلاً متعب أو خجول أو متقدم، ويتصرف في اليوم نفسه.',
                  'Dans une petite classe, l’enseignant remarque quand un enfant est fatigué, timide ou en avance, et agit le jour même.',
                  'In a small class, the teacher notices when a child is tired, shy or ahead, and acts the same day.') },
        { title: T('مدرسة بسيطة وقريبة', 'Une école simple et proche', 'A simple, close school'),
          text: T('بناية واحدة، سلكان، وفريق واحد. لا أروقة مزدحمة ولا أقسام مجهولة: الآباء يعرفون المعلمين، والمعلمون يعرفون الآباء.',
                  'Un bâtiment, deux cycles, une équipe. Pas de couloirs bondés ni de classes anonymes : les parents connaissent les enseignants, et les enseignants connaissent les parents.',
                  'One building, two cycles, one team. No crowded corridors or anonymous classes: parents know the teachers, and teachers know the parents.') }
      ],
      closing: T('نعرف طفلكم الصغير كما نعرف أطفالنا.', 'Nous connaissons votre petit comme les nôtres.', 'We know your little one like our own.')
    },
    voices: {
      items: [
        { text: T('كانت ابنتي واحدة من ثلاثين تلميذاً في القسم. هنا لاحظت معلمتها صعوبتها في الكسور قبلي، وعالجتها في أسبوع.',
                  'Ma fille était l’une des trente élèves d’une classe. Ici, son enseignante a remarqué ses difficultés avec les fractions avant moi, et les a réglées en une semaine.',
                  'My daughter used to be one of thirty in a class. Here her teacher noticed she was struggling with fractions before I did, and fixed it in a week.'),
          who: T('سميرة ك. — أم تلميذة في السنة الرابعة ابتدائي', 'Samira K. — parent, 4e année primaire', 'Samira K. — parent, 4th year primary') },
        { text: T('كان ابني يتردد عند باب المدرسة. اليوم يركض إلى الباب، وتستقبله معلمته باسمه.',
                  'Mon fils hésitait à l’entrée. Aujourd’hui il court vers la porte et sa maîtresse l’accueille par son prénom.',
                  'My son used to hesitate at the door. Now he runs in, and his teacher greets him by name.'),
          who: T('يوسف أ. — أب تلميذ في السنة الثانية ابتدائي', 'Youssef A. — parent, 2e année primaire', 'Youssef A. — parent, 2nd year primary') },
        { text: T('نعرف دائماً مستوى ابننا وما ينبغي فعله في البيت. لا مفاجآت عند تسليم التقارير.',
                  'Nous savons toujours où en est notre fils et quoi faire à la maison. Aucune surprise à la remise des bulletins.',
                  'We always know how our son is doing, and what to do at home. Nothing is a surprise at report time.'),
          who: T('ليلى م. — أم تلميذ في السنة الخامسة ابتدائي', 'Leila M. — parent, 5e année primaire', 'Leila M. — parent, 5th year primary') }
      ]
    },
    news: { big: T('ما يجري في المدرسة هذه الدورة.', 'Ce qui se passe à l’école ce semestre.', 'What is happening at school this term.') },
    downloads: { big: T('استمارات وجداول حصص ولائحة الرسوم. حمّل واطبع وانتهى الأمر.', 'Formulaires, emplois du temps et grille des frais. Téléchargez, imprimez, c’est fait.', 'Forms, timetables and the fee list. Download, print, done.') },
    app: {
      name: T('مزمار', 'Mizmar', 'Mizmar'),
      tagline: T('يومك الدراسي في تطبيق واحد.', 'Votre journée d’école, dans une seule application.', 'Your school day, in one app.'),
      text: T('يُبقي «مزمار» الأسر والتلاميذ على اطلاع دون أي ورقة. استبدل هذه الفقرة بما يفعله تطبيقك فعلاً.',
              'Mizmar tient les familles et les élèves informés sans un seul mot papier. Remplacez ce paragraphe par ce que fait réellement votre application.',
              'Mizmar keeps families and students in the loop without a single paper note. Replace this paragraph with what your app really does.'),
      features: [
        { title: T('الإعلانات', 'Annonces', 'Announcements'), text: T('يصلك كل إشعار من المدرسة لحظة نشره.', 'Chaque avis de l’école arrive dès sa publication.', 'Every school notice arrives the moment it is published.') },
        { title: T('جدول الحصص', 'Emploi du temps', 'Timetable'), text: T('حصص اليوم والأسبوع المقبل، محدَّثة دائماً.', 'Les cours d’aujourd’hui et de la semaine prochaine, toujours à jour.', 'Today’s lessons and next week’s, always up to date.') },
        { title: T('الرسائل', 'Messages', 'Messages'), text: T('راسل المعلمين والإدارة ببضع نقرات.', 'Écrivez aux enseignants et à l’administration en quelques touches.', 'Write to teachers and the office in a few taps.') }
      ],
      playUrl: '#',
      appleUrl: '#',
      extraLabel: T('', '', ''),
      extraUrl: ''
    },
    admissions: {
      year: T('التسجيل 2026 – 2027', 'Inscriptions 2026 – 2027', 'Admissions 2026 – 27'),
      big: T('تعالَ وشاهد المدرسة قبل أن تقرّر أي شيء.', 'Venez voir l’école avant de décider quoi que ce soit.', 'Come and see the school before you decide anything.'),
      steps: [
        { title: T('زيارة', 'Visite', 'Visit'), text: T('جولة مدتها 30 دقيقة مع مدير المدرسة.', 'Une visite de 30 minutes avec la direction.', 'A 30-minute tour with the director.') },
        { title: T('لقاء', 'Rencontre', 'Meet'), text: T('حديث ودّي مع طفلك. دون امتحان.', 'Une conversation détendue avec votre enfant. Pas d’examen.', 'A relaxed conversation with your child. No exam.') },
        { title: T('ملف', 'Dossier', 'Apply'), text: T('استمارة قصيرة وتقرير «مسار» للسنة الماضية.', 'Un court formulaire et le bulletin Massar de l’an dernier.', 'A short form and last year’s Massar report.') },
        { title: T('مرحباً بكم', 'Bienvenue', 'Welcome'), text: T('جواب في غضون عشرة أيام عمل.', 'Une réponse sous dix jours ouvrables.', 'A decision within ten working days.') }
      ],
      address: T('شارعكم، وجدة، المغرب', 'Votre rue, Oujda, Maroc', 'Your street, Oujda, Maroc'),
      phone: '+212 5 36 00 00 00',
      whatsapp: '+212 6 00 00 00 00',
      email: 'admissions@babrrayan.ma',
      hours: T('الإثنين – الجمعة، 08:30 – 14:30', 'Lun – Ven, 08h30 – 14h30', 'Mon – Fri, 08:30 – 14:30')
    }
  };

  /* ---------- Admin schema ---------- */
  var S = [
    { id: 'hero', title: 'Top of the page', fields: [
      { k: 'kicker', label: 'Small line above the title', type: 'text' },
      { k: 'title', label: 'Main title', type: 'text' },
      { k: 'lede', label: 'Intro paragraph', type: 'textarea' },
      { k: 'cta', label: 'Main button text', type: 'text' },
      { k: 'facts', label: 'Quick facts', type: 'list', add: 'Add a fact', item: [{ k: 'label', label: 'Label' }, { k: 'value', label: 'Value' }] }
    ] },
    { id: 'about', title: 'The school', fields: [
      { k: 'big', label: 'Big opening sentence', type: 'textarea' },
      { k: 'p1', label: 'Paragraph 1', type: 'textarea' },
      { k: 'p2', label: 'Paragraph 2', type: 'textarea' },
      { k: 'ticks', label: 'Highlights', type: 'list', add: 'Add a highlight', item: [{ k: 'text', label: 'Text' }] }
    ] },
    { id: 'stages', title: 'Cycles (preschool, primary)', fields: [
      { k: 'big', label: 'Heading', type: 'textarea' },
      { k: 'items', label: 'Cycles', type: 'list', add: 'Add a cycle', item: [
        { k: 'name', label: 'Name' }, { k: 'ages', label: 'Ages / years' },
        { k: 'desc', label: 'Description', type: 'textarea' }, { k: 'langs', label: 'Languages' }] }
    ] },
    { id: 'day', title: 'A school day', fields: [
      { k: 'big', label: 'Heading', type: 'text' },
      { k: 'items', label: 'Timetable', type: 'list', add: 'Add a time slot', item: [
        { k: 'time', label: 'Time (08:30)', plain: true }, { k: 'title', label: 'Title' }, { k: 'text', label: 'Description', type: 'textarea' }] }
    ] },
    { id: 'why', title: 'Why parents choose us', fields: [
      { k: 'big', label: 'Heading', type: 'textarea' },
      { k: 'items', label: 'Reasons (teachers, fees, small classes…)', type: 'list', add: 'Add a reason', item: [
        { k: 'title', label: 'Title' }, { k: 'text', label: 'Text', type: 'textarea' }] },
      { k: 'closing', label: 'Closing sentence', type: 'text' }
    ] },
    { id: 'voices', title: 'Family quotes', fields: [
      { k: 'items', label: 'Quotes (the first one is shown large)', type: 'list', add: 'Add a quote', item: [
        { k: 'text', label: 'Quote', type: 'textarea' }, { k: 'who', label: 'Who said it' }] }
    ] },
    { id: 'news', title: 'News & events heading', fields: [{ k: 'big', label: 'Heading', type: 'text' }] },
    { id: 'downloads', title: 'Downloads heading', fields: [{ k: 'big', label: 'Heading', type: 'text' }] },
    { id: 'app', title: 'Mobile app', fields: [
      { k: 'name', label: 'App name', type: 'text' },
      { k: 'tagline', label: 'Tagline', type: 'text' },
      { k: 'text', label: 'Description', type: 'textarea' },
      { k: 'features', label: 'Features', type: 'list', add: 'Add a feature', item: [{ k: 'title', label: 'Title' }, { k: 'text', label: 'Text' }] },
      { k: 'playUrl', label: 'Google Play link (empty = hide button)', plain: true },
      { k: 'appleUrl', label: 'App Store link (empty = hide button)', plain: true },
      { k: 'extraLabel', label: 'Extra button text (e.g. Download APK)' },
      { k: 'extraUrl', label: 'Extra button link', plain: true }
    ] },
    { id: 'admissions', title: 'Admissions & contact', fields: [
      { k: 'year', label: 'Section label' },
      { k: 'big', label: 'Heading' },
      { k: 'steps', label: 'Steps', type: 'list', add: 'Add a step', item: [{ k: 'title', label: 'Title' }, { k: 'text', label: 'Text' }] },
      { k: 'address', label: 'Address' },
      { k: 'phone', label: 'Phone', plain: true },
      { k: 'whatsapp', label: 'WhatsApp number', plain: true },
      { k: 'email', label: 'Email', plain: true },
      { k: 'hours', label: 'Office hours' }
    ] }
  ];

  /* ---------- Interface words ---------- */
  var U = {
    navAbout: T('المدرسة', 'L’école', 'The school'),
    navStages: T('الأسلاك', 'Cycles', 'Cycles'),
    navNews: T('الأخبار', 'Actualités', 'News'),
    navDownloads: T('التحميلات', 'Téléchargements', 'Downloads'),
    navApp: T('تطبيق {app}', 'Appli {app}', '{app} app'),
    book: T('احجز زيارة', 'Réserver une visite', 'Book a visit'),
    seeStages: T('اكتشف الأسلاك', 'Voir les cycles', 'See the cycles'),
    artCap: T('باب الريان — باب الرواء', 'Bab ar-Rayyan — la porte des désaltérés', 'Bab ar-Rayyan — the gate of the well-watered'),
    lblAbout: T('المدرسة', 'L’école', 'The school'),
    lblStages: T('الأسلاك الدراسية', 'Les cycles', 'The cycles'),
    lblDay: T('يوم في المدرسة', 'Une journée à l’école', 'A school day'),
    lblWhy: T('لماذا باب الريان', 'Pourquoi Bab Rrayan', 'Why Bab Rrayan'),
    lblFamilies: T('الأسر', 'Familles', 'Families'),
    lblNews: T('الأخبار والأنشطة', 'Actualités et événements', 'News & events'),
    lblDownloads: T('التحميلات', 'Téléchargements', 'Downloads'),
    lblApp: T('التطبيق', 'L’application', 'The app'),
    subAnn: T('الإعلانات', 'Annonces', 'Announcements'),
    subEv: T('قريباً', 'À venir', 'Coming up'),
    formTitle: T('طلب زيارة', 'Demander une visite', 'Request a visit'),
    formSub: T('اتركوا بياناتكم وسنتصل بكم لتحديد موعد.', 'Laissez vos coordonnées, nous vous appelons pour fixer un rendez-vous.', 'Leave your details and we will call you to fix a time.'),
    fName: T('الاسم الكامل', 'Votre nom', 'Your name'),
    fPhone: T('رقم الهاتف / واتساب', 'Téléphone / WhatsApp', 'Phone / WhatsApp'),
    send: T('إرسال الطلب', 'Envoyer la demande', 'Send request'),
    fEmail: T('البريد الإلكتروني', 'E-mail', 'Email'),
    fStage: T('السلك الذي سيدخله طفلكم', 'Cycle de votre enfant', 'Your child’s cycle'),
    st1: T('التعليم الأولي (3–5 سنوات)', 'Maternelle (3–5 ans)', 'Preschool (3–5)'),
    st2: T('الابتدائي (السنة 1–6)', 'Primaire (1re–6e année)', 'Primary (1st–6th year)'),
    fMsg: T('هل هناك ما تودّ إخبارنا به؟', 'Quelque chose à nous dire ?', 'Anything we should know?'),
    fOk: T('شكراً لكم. سنرد عليكم خلال يومي عمل.', 'Merci. Nous vous répondrons sous deux jours ouvrables.', 'Thank you. We will reply within two working days.'),
    fErr: T('عذراً، لم يصل الطلب. المرجو الاتصال بنا أو مراسلتنا عبر واتساب.', 'Désolé, l’envoi a échoué. Appelez-nous ou écrivez-nous sur WhatsApp.', 'Sorry, that did not go through. Please call or WhatsApp us instead.'),
    cAddress: T('العنوان', 'Adresse', 'Address'),
    cPhone: T('الهاتف', 'Téléphone', 'Phone'),
    cEmail: T('البريد', 'E-mail', 'Email'),
    cOffice: T('الإدارة', 'Secrétariat', 'Office'),
    all: T('الكل', 'Tous', 'All'),
    pinned: T('مثبّت', 'Épinglé', 'Pinned'),
    download: T('تحميل', 'Télécharger', 'Download'),
    noAnn: T('لا توجد إعلانات حالياً.', 'Aucune annonce pour le moment.', 'No announcements right now.'),
    noEv: T('لا توجد أنشطة قادمة. عودوا قريباً.', 'Aucun événement à venir. Revenez bientôt.', 'No upcoming events. Check back soon.'),
    noFiles: T('لا توجد مستندات بعد.', 'Pas encore de documents.', 'No documents yet.'),
    soon: T('روابط التحميل ستتوفر قريباً.', 'Liens de téléchargement bientôt disponibles.', 'Download links coming soon.'),
    gplay: T('حمّله من Google Play', 'Disponible sur Google Play', 'Get it on Google Play'),
    appstore: T('حمّله من App Store', 'Télécharger sur l’App Store', 'Download on the App Store'),
    dlDefault: T('تحميل', 'Télécharger', 'Download'),
    call: T('اتصال', 'Appeler', 'Call'),
    staff: T('دخول الأطر', 'Espace personnel', 'Staff login'),
    footer: T('مدرسة باب الريان الخاصة، وجدة، المغرب', 'École privée Bab Rrayan, Oujda, Maroc', 'Bab Rrayan private school, Oujda, Morocco'),
    menuOpen: T('فتح القائمة', 'Ouvrir le menu', 'Open menu'),
    menuClose: T('إغلاق القائمة', 'Fermer le menu', 'Close menu'),
    dismiss: T('إغلاق الإعلان', 'Fermer l’annonce', 'Dismiss announcement'),
    cat_forms: T('استمارات', 'Formulaires', 'Forms'),
    cat_timetables: T('جداول الحصص', 'Emplois du temps', 'Timetables'),
    cat_fees: T('الرسوم', 'Frais de scolarité', 'Fees'),
    cat_programs: T('البرامج', 'Programmes', 'Programs'),
    cat_other: T('أخرى', 'Autres', 'Other')
  };

  var META = {
    ar: { title: 'مدرسة باب الريان الخاصة بوجدة | Bab Rrayan École privée Oujda',
          desc: 'باب الريان (Bab Rrayan / Bab Alrayan): مدرسة خاصة للتعليم الأولي والابتدائي بوجدة، بالعربية والفرنسية والإنجليزية. أقسام صغيرة ورسوم في المتناول. التسجيل مفتوح 2026-2027.' },
    fr: { title: 'Bab Rrayan – École privée primaire à Oujda | مدرسة باب الريان',
          desc: 'École privée à Oujda : Bab Rrayan (Bab Alrayan, باب الريان), préscolaire et primaire. Petites classes, enseignants compétents, frais accessibles. Inscriptions ouvertes 2026-2027.' },
    en: { title: 'Bab Rrayan – Private primary school in Oujda | مدرسة باب الريان',
          desc: 'Bab Rrayan (Bab Alrayan, باب الريان) is a private preschool and primary school in Oujda, Morocco. Small classes, skilled teachers, fair fees. Admissions open 2026-27.' }
  };

  /* Shown only while Firebase is not connected, so the design is never empty. */
  var DEMO = {
    announcements: [
      { id: 'a1', title: T('التسجيل للموسم 2026–2027 مفتوح', 'Les inscriptions 2026–2027 sont ouvertes', 'Registration for 2026–27 is open'),
        body: T('الأماكن محدودة في كل قسم. احجزوا زيارة لاكتشاف المدرسة قبل التسجيل.', 'Les places sont limitées dans chaque classe. Réservez une visite pour découvrir l’école avant de vous inscrire.', 'Places are limited in every class. Book a visit to see the school before you apply.'),
        date: '2026-09-15', pinned: true, show: true },
      { id: 'a2', title: T('لائحة الرسوم وجداول الحصص متوفرة', 'La grille des frais et les emplois du temps sont en ligne', 'The fee list and timetables are online'),
        body: T('ستجدونها في قسم التحميلات.', 'À retrouver dans la section Téléchargements.', 'Find them in the Downloads section below.'),
        date: '2026-09-22', pinned: false, show: true }
    ],
    events: [
      { id: 'e1', title: T('يوم مفتوح للأسر', 'Journée portes ouvertes', 'Open Day for families'), date: '2026-10-12', time: '09:00 – 14:00', place: T('في المدرسة', 'À l’école', 'At the school'), description: T('جولات كل نصف ساعة.', 'Visites toutes les trente minutes.', 'Tours every thirty minutes.') },
      { id: 'e2', title: T('لقاء الآباء والمعلمين', 'Rencontre parents-enseignants', 'Parent-teacher meeting'), date: '2026-10-28', time: '14:45', place: T('في الأقسام', 'Dans les classes', 'In the classrooms'), description: T('احجزوا موعداً مع معلم طفلكم.', 'Prenez rendez-vous avec l’enseignant de votre enfant.', 'Book a slot with your child’s teacher.') },
      { id: 'e3', title: T('حفل نهاية الدورة للأطفال', 'Fête de fin de semestre des enfants', 'End-of-term children’s show'), date: '2026-11-05', time: '13:30', place: T('في المدرسة', 'À l’école', 'At the school'), description: T('', '', '') }
    ],
    files: [
      { id: 'f1', title: T('استمارة التسجيل 2026–2027', 'Formulaire d’inscription 2026–2027', 'Enrolment form 2026–27'), category: 'forms', url: '#', description: T('املأها ووقّعها وأحضرها إلى الإدارة.', 'À remplir, signer et déposer au secrétariat.', 'Fill in, sign and bring to the office.') },
      { id: 'f2', title: T('جدول حصص الابتدائي', 'Emploi du temps du primaire', 'Primary timetable'), category: 'timetables', url: '#', description: T('ساري من الدخول المدرسي.', 'Valable dès la rentrée.', 'Valid from the rentrée.') },
      { id: 'f3', title: T('لائحة الرسوم 2026–2027', 'Grille des frais 2026–2027', 'Fee list 2026–27'), category: 'fees', url: '#', description: T('واضحة وبدون مصاريف خفية.', 'Claire, sans frais cachés.', 'Clear, with no hidden extras.') },
      { id: 'f4', title: T('لائحة الأدوات المدرسية', 'Liste des fournitures scolaires', 'School supplies list'), category: 'forms', url: '#', description: T('حسب السلك.', 'Par cycle.', 'Per cycle.') }
    ]
  };

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* A translatable value is {ar,fr,en}; old plain strings still work. Falls back ar → fr → en. */
  function t(v, lang) {
    if (v == null) return '';
    if (typeof v !== 'object') return String(v);
    return v[lang] || v.ar || v.fr || v.en || '';
  }
  function ui(key, lang) { return U[key] ? (U[key][lang] || U[key].ar) : key; }
  function safeUrl(u) {
    u = String(u || '').trim();
    return /^(javascript|data|vbscript):/i.test(u) ? '#' : u;
  }
  /* Google Drive "share" links become direct downloads. */
  function fileUrl(u) {
    u = safeUrl(u);
    var m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/open\?id=([\w-]+)/);
    return m ? 'https://drive.google.com/uc?export=download&id=' + m[1] : u;
  }
  function fileExt(u) {
    var m = String(u || '').split('?')[0].match(/\.([a-z0-9]{2,4})$/i);
    return m ? m[1].toUpperCase() : (/drive\.google/.test(u) ? 'PDF' : 'FILE');
  }
  var LOCALES = { ar: 'ar-MA-u-nu-latn', fr: 'fr-FR', en: 'en-GB' };
  function fmtDate(d, lang) {
    var x = new Date(d + 'T00:00:00');
    return isNaN(x) ? '' : x.toLocaleDateString(LOCALES[lang || 'en'], { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function merge(saved) {
    var out = {};
    Object.keys(D).forEach(function (s) { out[s] = Object.assign({}, D[s], (saved && saved[s]) || {}); });
    return out;
  }

  /* ---------- Firebase ---------- */
  var cfg = window.FIREBASE_CONFIG;
  var configured = !!(cfg && cfg.apiKey && cfg.projectId && !/YOUR_/.test(cfg.apiKey));
  var db = null, auth = null;
  if (configured && window.firebase) {
    try {
      firebase.initializeApp(cfg);
      db = firebase.firestore();
      if (firebase.auth) auth = firebase.auth();
    } catch (e) { console.warn('Firebase init failed', e); }
  }

  function rows(snap) { return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); }

  function load() {
    var out = { content: merge(null), announcements: DEMO.announcements, events: DEMO.events, files: DEMO.files, live: false };
    if (!db) return Promise.resolve(out);
    var fetchAll = Promise.all([
      db.doc('site/content').get(),
      db.collection('announcements').get(),
      db.collection('events').get(),
      db.collection('files').get()
    ]);
    var timeout = new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 6000); });
    return Promise.race([fetchAll, timeout]).then(function (r) {
      return {
        content: merge(r[0].exists ? r[0].data() : null),
        announcements: rows(r[1]), events: rows(r[2]), files: rows(r[3]), live: true
      };
    }).catch(function (e) {
      console.warn('Could not load from Firebase, showing defaults.', e);
      out.announcements = []; out.events = []; out.files = [];
      return out;
    });
  }

  return { langs: LANGS, defaults: D, schema: S, ui: U, meta: META, demo: DEMO, configured: configured, db: db, auth: auth,
           esc: esc, t: t, uiText: ui, safeUrl: safeUrl, fileUrl: fileUrl, fileExt: fileExt, fmtDate: fmtDate, merge: merge, load: load };
})();
