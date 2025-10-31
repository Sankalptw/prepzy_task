import { query } from '../config/database';

/**
 * SEED DATA
 * 10 Topics with 10 questions each (100 total questions)
 * This runs once to populate the database with sample data
 */

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Check if data already exists
    const topicsCheck = await query('SELECT COUNT(*) FROM topics');
    if (parseInt(topicsCheck.rows[0].count) > 0) {
      console.log('✅ Database already seeded, skipping...');
      return;
    }

    // SEED TOPICS
    const topics = [
      {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Test your JavaScript fundamentals and ES6+ features',
        icon: '⚡',
        difficulty: 'intermediate',
      },
      {
        name: 'Python',
        slug: 'python',
        description: 'Learn Python programming from basics to advanced',
        icon: '🐍',
        difficulty: 'beginner',
      },
      {
        name: 'General Knowledge',
        slug: 'general-knowledge',
        description: 'World affairs, history, and current events',
        icon: '🌍',
        difficulty: 'beginner',
      },
      {
        name: 'Aptitude',
        slug: 'aptitude',
        description: 'Logical reasoning and quantitative aptitude questions',
        icon: '🧠',
        difficulty: 'beginner',
      },
      {
        name: 'Data Structures',
        slug: 'data-structures',
        description: 'Arrays, Trees, Graphs, and algorithmic thinking',
        icon: '📊',
        difficulty: 'advanced',
      },
      {
        name: 'HTML & CSS',
        slug: 'html-css',
        description: 'Learn web design and frontend development',
        icon: '🎨',
        difficulty: 'beginner',
      },
      {
        name: 'React',
        slug: 'react',
        description: 'Master React and modern JavaScript frameworks',
        icon: '⚛️',
        difficulty: 'intermediate',
      },
      {
        name: 'SQL',
        slug: 'sql',
        description: 'Learn database queries and SQL fundamentals',
        icon: '🗄️',
        difficulty: 'beginner',
      },
      {
        name: 'Mathematics',
        slug: 'mathematics',
        description: 'Test your mathematical knowledge and problem-solving',
        icon: '🔢',
        difficulty: 'intermediate',
      },
      {
        name: 'English',
        slug: 'english',
        description: 'Improve grammar, vocabulary, and comprehension skills',
        icon: '📚',
        difficulty: 'beginner',
      },
    ];

    for (const topic of topics) {
      await query(
        `INSERT INTO topics (name, slug, description, icon, difficulty) 
         VALUES ($1, $2, $3, $4, $5)`,
        [topic.name, topic.slug, topic.description, topic.icon, topic.difficulty]
      );
    }

    console.log('✅ Topics seeded');

    // Get topic IDs
    const getTopicId = async (slug: string) => {
      const result = await query(`SELECT id FROM topics WHERE slug = $1`, [slug]);
      return result.rows[0].id;
    };

    const jsTopicId = await getTopicId('javascript');
    const pythonTopicId = await getTopicId('python');
    const gkTopicId = await getTopicId('general-knowledge');
    const aptTopicId = await getTopicId('aptitude');
    const dsTopicId = await getTopicId('data-structures');
    const htmlCssTopicId = await getTopicId('html-css');
    const reactTopicId = await getTopicId('react');
    const sqlTopicId = await getTopicId('sql');
    const mathTopicId = await getTopicId('mathematics');
    const englishTopicId = await getTopicId('english');

    // JAVASCRIPT QUESTIONS
    const jsQuestions = [
      {
        question: 'What is the output of: console.log(typeof null)?',
        options: ['null', 'undefined', 'object', 'number'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'typeof null returns "object" due to a historical bug in JavaScript that was never fixed for backward compatibility.',
      },
      {
        question: 'Which method is used to add elements to the end of an array?',
        options: ['shift()', 'push()', 'unshift()', 'pop()'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
      },
      {
        question: 'What does the "this" keyword refer to in JavaScript?',
        options: ['The function itself', 'The global object', 'The object that owns the executing code', 'undefined'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: '"this" refers to the object that is executing the current function. Its value depends on how the function is called.',
      },
      {
        question: 'What is a closure in JavaScript?',
        options: ['A function with no parameters', 'A function that returns another function', 'A function that has access to variables in its outer scope', 'A built-in JavaScript method'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
      },
      {
        question: 'What is the difference between "==" and "===" operators?',
        options: ['No difference', '"==" checks type, "===" checks value', '"==" checks value only, "===" checks value and type', 'Both are deprecated'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: '"==" performs type coercion before comparison, while "===" (strict equality) checks both value and type without coercion.',
      },
      {
        question: 'What will be the output: [1, 2, 3] + [4, 5, 6]?',
        options: ['[1,2,3,4,5,6]', '"1,2,34,5,6"', 'Error', '[7, 7, 9]'],
        correct_answer: 1,
        difficulty: 'hard',
        explanation: 'Array addition converts both arrays to strings and concatenates them, resulting in "1,2,34,5,6".',
      },
      {
        question: 'Which ES6 feature allows you to extract values from arrays or objects?',
        options: ['Spread operator', 'Destructuring', 'Template literals', 'Arrow functions'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Destructuring assignment allows you to unpack values from arrays or properties from objects into distinct variables.',
      },
      {
        question: 'What is the purpose of async/await in JavaScript?',
        options: ['To make synchronous code', 'To handle asynchronous operations more elegantly', 'To replace callbacks entirely', 'To improve performance'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'async/await provides a cleaner syntax for working with Promises, making asynchronous code look and behave more like synchronous code.',
      },
      {
        question: 'What does event bubbling mean in JavaScript?',
        options: ['Events are lost', 'Events propagate from child to parent elements', 'Events happen twice', 'Events are cancelled'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Event bubbling is when an event propagates from the target element up through its ancestors in the DOM tree.',
      },
      {
        question: 'What is the temporal dead zone in JavaScript?',
        options: ['A deprecated feature', 'Time between variable creation and initialization', 'A type of memory leak', 'A debugging tool'],
        correct_answer: 1,
        difficulty: 'hard',
        explanation: 'The temporal dead zone is the period between entering scope and variable initialization where accessing the variable throws a ReferenceError.',
      },
    ];

    // PYTHON QUESTIONS
    const pythonQuestions = [
      {
        question: 'Which keyword is used to create a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'The "def" keyword is used to define functions in Python.',
      },
      {
        question: 'What is the correct way to create a list in Python?',
        options: ['list = {1, 2, 3}', 'list = [1, 2, 3]', 'list = (1, 2, 3)', 'list = 1, 2, 3'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Square brackets [] are used to create lists in Python.',
      },
      {
        question: 'What does len() do?',
        options: ['Creates length', 'Returns the length of an object', 'Compares lengths', 'Defines a variable'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'len() returns the number of items in an object like strings, lists, tuples, etc.',
      },
      {
        question: 'How do you create a dictionary in Python?',
        options: ['{1, 2, 3}', '[1, 2, 3]', '{"key": "value"}', '(1, 2, 3)'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'Dictionaries use curly braces with key-value pairs separated by colons.',
      },
      {
        question: 'What is a tuple in Python?',
        options: ['A mutable list', 'An immutable sequence', 'A dictionary', 'A function'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'A tuple is an immutable sequence of elements that cannot be changed after creation.',
      },
      {
        question: 'How do you import a module in Python?',
        options: ['include module', 'import module', 'require module', 'load module'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'The "import" keyword is used to import modules in Python.',
      },
      {
        question: 'What is a lambda function?',
        options: ['A regular function', 'An anonymous function', 'A class method', 'A loop'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'A lambda function is a small anonymous function in Python created with the lambda keyword.',
      },
      {
        question: 'How do you handle exceptions in Python?',
        options: ['try/except', 'if/else', 'while/break', 'for/continue'],
        correct_answer: 0,
        difficulty: 'medium',
        explanation: 'try/except blocks are used to handle exceptions in Python.',
      },
      {
        question: 'What is a list comprehension?',
        options: ['Compressing lists', 'Creating lists with a concise syntax', 'Comparing lists', 'Copying lists'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'List comprehension is a concise way to create new lists based on existing sequences.',
      },
      {
        question: 'What does the range() function do?',
        options: ['Finds max value', 'Creates a sequence of numbers', 'Measures distance', 'Compares values'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'range() creates a sequence of numbers from 0 to n-1.',
      },
    ];

    // GENERAL KNOWLEDGE QUESTIONS
    const gkQuestions = [
      {
        question: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'Canberra is the capital city of Australia, though Sydney is more well-known.',
      },
      {
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'The Mona Lisa was painted by Leonardo da Vinci between 1503 and 1519.',
      },
      {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correct_answer: 3,
        difficulty: 'easy',
        explanation: 'The Pacific Ocean is the largest ocean, covering more than 63 million square miles.',
      },
      {
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'World War II ended in 1945 with the surrender of Japan in September.',
      },
      {
        question: 'What is the smallest country in the world by area?',
        options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Vatican City is the smallest country, with an area of only 0.17 square miles.',
      },
      {
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Romeo and Juliet was written by William Shakespeare around 1594-1596.',
      },
      {
        question: 'What is the currency of Japan?',
        options: ['Won', 'Yuan', 'Yen', 'Ringgit'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'The Japanese Yen (¥) is the official currency of Japan.',
      },
      {
        question: 'How many continents are there on Earth?',
        options: ['5', '6', '7', '8'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, South America, and Australia.',
      },
      {
        question: 'What is the speed of light in vacuum?',
        options: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '99,792 km/s'],
        correct_answer: 0,
        difficulty: 'medium',
        explanation: 'The speed of light in vacuum is approximately 299,792 kilometers per second.',
      },
      {
        question: 'Who is known as the "Father of Computers"?',
        options: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Charles Babbage is known as the Father of Computers for designing the first mechanical computer.',
      },
    ];

    // APTITUDE QUESTIONS
    const aptQuestions = [
      {
        question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?',
        options: ['60 km/h', '70 km/h', '80 km/h', '90 km/h'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'Speed = Distance/Time. 60 km / 0.75 hours = 80 km/h.',
      },
      {
        question: 'What is 15% of 200?',
        options: ['20', '25', '30', '35'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: '15% of 200 = (15/100) × 200 = 30.',
      },
      {
        question: 'If 5 workers can complete a task in 12 days, how many days will 3 workers take?',
        options: ['15 days', '18 days', '20 days', '24 days'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'This is inverse proportion. 5 × 12 = 60 man-days. 60 / 3 = 20 days.',
      },
      {
        question: 'What comes next in the series: 2, 6, 12, 20, 30, ?',
        options: ['38', '40', '42', '44'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'Differences are 4, 6, 8, 10, 12. Next difference is 12, so 30 + 12 = 42.',
      },
      {
        question: 'A shopkeeper sells an item at 25% profit. If the cost price is ₹400, what is the selling price?',
        options: ['₹450', '₹475', '₹500', '₹525'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'SP = CP + (25% of CP) = 400 + 100 = ₹500.',
      },
      {
        question: 'If A is twice as fast as B, and together they can finish work in 12 days, how long will B take alone?',
        options: ['24 days', '30 days', '36 days', '40 days'],
        correct_answer: 2,
        difficulty: 'hard',
        explanation: 'Let B take x days. A takes x/2 days. 1/x + 2/x = 1/12. Solving: x = 36 days.',
      },
      {
        question: 'What is the average of first 10 natural numbers?',
        options: ['5', '5.5', '6', '10'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Average = (1+2+...+10)/10 = 55/10 = 5.5.',
      },
      {
        question: 'A bag contains 5 red and 3 blue balls. What is the probability of drawing a red ball?',
        options: ['3/8', '5/8', '1/2', '2/3'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Probability = Favorable outcomes / Total outcomes = 5 / (5+3) = 5/8.',
      },
      {
        question: 'If the ratio of ages of A and B is 3:4, and the sum of their ages is 35, what is A\'s age?',
        options: ['12', '15', '18', '20'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Let ages be 3x and 4x. 3x + 4x = 35, so 7x = 35, x = 5. A\'s age = 3×5 = 15.',
      },
      {
        question: 'A number is increased by 20% and then decreased by 20%. What is the net change?',
        options: ['0%', '4% decrease', '4% increase', '2% decrease'],
        correct_answer: 1,
        difficulty: 'hard',
        explanation: 'Let number be 100. After +20%: 120. After -20% of 120: 96. Net change = 4% decrease.',
      },
    ];

    // DATA STRUCTURES QUESTIONS
    const dsQuestions = [
      {
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each iteration.',
      },
      {
        question: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.',
      },
      {
        question: 'What is the worst-case time complexity of Quick Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'Quick Sort has O(n²) worst-case complexity when the pivot is always the smallest or largest element.',
      },
      {
        question: 'In a binary tree, what is a leaf node?',
        options: ['Root node', 'Node with no children', 'Node with one child', 'Node with two children'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'A leaf node is a node that has no children (both left and right child are null).',
      },
      {
        question: 'Which traversal method visits nodes level by level?',
        options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
        correct_answer: 3,
        difficulty: 'medium',
        explanation: 'Level-order traversal (BFS) visits all nodes at each level before moving to the next level.',
      },
      {
        question: 'What is the space complexity of a recursive Fibonacci function?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correct_answer: 2,
        difficulty: 'hard',
        explanation: 'Recursive Fibonacci has O(n) space complexity due to the maximum depth of the recursion call stack.',
      },
      {
        question: 'Which data structure is best for implementing LRU cache?',
        options: ['Array', 'Linked List', 'Hash Map + Doubly Linked List', 'Binary Tree'],
        correct_answer: 2,
        difficulty: 'hard',
        explanation: 'LRU cache is efficiently implemented using Hash Map for O(1) access and Doubly Linked List for O(1) insertion/deletion.',
      },
      {
        question: 'What is the height of a balanced binary tree with n nodes?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(√n)'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'A balanced binary tree has height O(log n), which is why operations on balanced trees are efficient.',
      },
      {
        question: 'Which sorting algorithm is stable and has O(n log n) complexity?',
        options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'Merge Sort is stable (maintains relative order of equal elements) and has guaranteed O(n log n) complexity.',
      },
      {
        question: 'What is a hash collision?',
        options: ['Memory overflow', 'Two keys mapping to same hash value', 'Duplicate data', 'Hash function error'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'A hash collision occurs when two different keys produce the same hash value, requiring collision resolution techniques.',
      },
    ];

    // HTML & CSS QUESTIONS
    const htmlCssQuestions = [
      {
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correct_answer: 0,
        difficulty: 'easy',
        explanation: 'HTML stands for Hyper Text Markup Language.',
      },
      {
        question: 'Which tag is used for the largest heading in HTML?',
        options: ['<h1>', '<h6>', '<heading>', '<title>'],
        correct_answer: 0,
        difficulty: 'easy',
        explanation: '<h1> is used for the largest heading, <h6> for the smallest.',
      },
      {
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'CSS stands for Cascading Style Sheets.',
      },
      {
        question: 'How do you comment in CSS?',
        options: ['// comment', '# comment', '/* comment */', '<!-- comment -->'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'CSS comments use /* comment */',
      },
      {
        question: 'What is the default display value of a div element?',
        options: ['inline', 'block', 'flex', 'grid'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'The default display value of a div is block.',
      },
      {
        question: 'How do you select an element with id "main" in CSS?',
        options: ['.main', '#main', 'main', '@main'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Use # to select an element by id.',
      },
      {
        question: 'What is the correct HTML for creating a link?',
        options: ['<link>Google</link>', '<a href="url">Google</a>', '<url>Google</url>', '<href>Google</href>'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: '<a> tag with href attribute is used to create links.',
      },
      {
        question: 'What does the <meta> tag do?',
        options: ['Creates metadata', 'Creates hyperlinks', 'Defines page structure', 'Styles text'],
        correct_answer: 0,
        difficulty: 'medium',
        explanation: 'The <meta> tag defines metadata about the HTML document.',
      },
      {
        question: 'How do you center text in CSS?',
        options: ['align: center', 'text-align: center', 'center: text', 'alignment: center'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'text-align: center is used to center text horizontally.',
      },
      {
        question: 'What is the box model in CSS?',
        options: ['A 3D model', 'Content, padding, border, margin', 'HTML structure', 'Layout system'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'The box model consists of content, padding, border, and margin.',
      },
    ];

    // REACT QUESTIONS
    const reactQuestions = [
      {
        question: 'What is React?',
        options: ['A database', 'A JavaScript library for building UIs', 'A CSS framework', 'A backend framework'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'React is a JavaScript library for building user interfaces with reusable components.',
      },
      {
        question: 'What is a React component?',
        options: ['A CSS class', 'A reusable piece of UI', 'A function in JavaScript', 'A database'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'A React component is a reusable piece of UI that returns JSX.',
      },
      {
        question: 'What is state in React?',
        options: ['A country', 'Data that changes and affects rendering', 'A CSS property', 'A function'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'State is data that changes and causes component re-render when updated.',
      },
      {
        question: 'What is a prop in React?',
        options: ['A property of CSS', 'Data passed to a component', 'A React file', 'A function'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Props are arguments passed to React components, similar to function parameters.',
      },
      {
        question: 'How do you create a functional component in React?',
        options: ['class Component', 'function Component()', 'const Component = ()', 'B and C are both valid'],
        correct_answer: 3,
        difficulty: 'easy',
        explanation: 'Both function and arrow function syntax can be used to create functional components.',
      },
      {
        question: 'What is the useEffect hook used for?',
        options: ['Effects styling', 'Side effects in components', 'Creating effects', 'Animations'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'useEffect is used to handle side effects in functional components like fetching data.',
      },
      {
        question: 'What is useState used for?',
        options: ['State styling', 'Managing component state', 'Using state variables', 'Declaring styles'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'useState is used to add state to functional components.',
      },
      {
        question: 'What is JSX?',
        options: ['A function', 'JavaScript XML syntax', 'A styling language', 'A database'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'JSX is a syntax extension to write HTML-like code in JavaScript.',
      },
      {
        question: 'What is the virtual DOM in React?',
        options: ['An imaginary DOM', 'In-memory representation of the DOM', 'The real DOM', 'A database'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Virtual DOM is React\'s in-memory representation of the real DOM used for optimization.',
      },
      {
        question: 'How do you pass data from parent to child in React?',
        options: ['Using props', 'Using state', 'Using functions', 'Using URLs'],
        correct_answer: 0,
        difficulty: 'easy',
        explanation: 'Data flows from parent to child components through props.',
      },
    ];

    // SQL QUESTIONS
    const sqlQuestions = [
      {
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Special Query Language'],
        correct_answer: 0,
        difficulty: 'easy',
        explanation: 'SQL stands for Structured Query Language.',
      },
      {
        question: 'Which SQL statement is used to retrieve data?',
        options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'SELECT is used to retrieve data from a database.',
      },
      {
        question: 'How do you insert data into a table?',
        options: ['ADD', 'PUT', 'INSERT INTO', 'CREATE'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'INSERT INTO is used to insert data into a table.',
      },
      {
        question: 'What does WHERE clause do?',
        options: ['Filters results', 'Orders results', 'Groups results', 'Limits results'],
        correct_answer: 0,
        difficulty: 'medium',
        explanation: 'WHERE clause filters query results based on conditions.',
      },
      {
        question: 'How do you update a record in SQL?',
        options: ['CHANGE', 'UPDATE', 'MODIFY', 'EDIT'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'UPDATE statement is used to modify existing records.',
      },
      {
        question: 'What does JOIN do in SQL?',
        options: ['Combines tables', 'Adds rows', 'Removes columns', 'Filters data'],
        correct_answer: 0,
        difficulty: 'medium',
        explanation: 'JOIN combines rows from two or more tables based on a related column.',
      },
      {
        question: 'What is a primary key?',
        options: ['The main column', 'A unique identifier for a record', 'The first column', 'A security key'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'A primary key uniquely identifies each record in a table.',
      },
      {
        question: 'What does COUNT() do?',
        options: ['Adds numbers', 'Returns number of rows', 'Counts characters', 'Counts columns'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'COUNT() returns the number of rows that match criteria.',
      },
      {
        question: 'How do you sort results in SQL?',
        options: ['ARRANGE', 'ORDER BY', 'SORT', 'GROUP'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'ORDER BY is used to sort query results in ascending or descending order.',
      },
      {
        question: 'What is a foreign key?',
        options: ['A security key', 'A reference to primary key in another table', 'A backup key', 'A password'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'A foreign key is a reference to a primary key in another table.',
      },
    ];

    // MATHEMATICS QUESTIONS
    const mathQuestions = [
      {
        question: 'What is the value of π (pi) approximately?',
        options: ['3.12', '3.14', '3.16', '3.18'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'π (pi) is approximately 3.14159...',
      },
      {
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '13'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: '√144 = 12 because 12 × 12 = 144.',
      },
      {
        question: 'What is the formula for the area of a circle?',
        options: ['πr', 'πr²', '2πr', 'πd'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Area of circle = πr² where r is the radius.',
      },
      {
        question: 'What is 5! (factorial)?',
        options: ['20', '100', '120', '150'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: '5! = 5×4×3×2×1 = 120.',
      },
      {
        question: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'The sum of all angles in a triangle is always 180°.',
      },
      {
        question: 'What is 2³?',
        options: ['6', '8', '9', '12'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: '2³ = 2×2×2 = 8.',
      },
      {
        question: 'What is the formula for the volume of a cube?',
        options: ['a²', 'a³', '2a', 'a+a'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Volume of cube = a³ where a is the side length.',
      },
      {
        question: 'What is 12 × 11?',
        options: ['120', '121', '132', '143'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: '12 × 11 = 132.',
      },
      {
        question: 'What is the probability of getting heads on a coin flip?',
        options: ['0', '0.25', '0.5', '1'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'Probability of heads on a fair coin = 0.5 or 50%.',
      },
      {
        question: 'What is the median of 1, 3, 5, 7, 9?',
        options: ['3', '5', '7', '9'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'The median is the middle value: 5.',
      },
    ];

    // ENGLISH QUESTIONS
    const englishQuestions = [
      {
        question: 'Which of these is a noun?',
        options: ['Run', 'Beautiful', 'Book', 'Quickly'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'Book is a noun (a person, place, or thing).',
      },
      {
        question: 'What is the past tense of "go"?',
        options: ['Goes', 'Gone', 'Went', 'Going'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'The past tense of go is went.',
      },
      {
        question: 'Which word is spelled correctly?',
        options: ['Recieve', 'Recieve', 'Receive', 'Recieve'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'The correct spelling is "Receive" (i before e except after c).',
      },
      {
        question: 'What is a synonym for "happy"?',
        options: ['Sad', 'Joyful', 'Angry', 'Tired'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'Joyful is a synonym for happy.',
      },
      {
        question: 'What is the plural of "child"?',
        options: ['Childs', 'Children', 'Childes', 'Child\'s'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'The plural of child is children (irregular plural).',
      },
      {
        question: 'Which sentence is correct?',
        options: ['She go to school', 'She goes to school', 'She going to school', 'She gone to school'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'Correct: She goes to school (third person singular).',
      },
      {
        question: 'What is an antonym for "big"?',
        options: ['Large', 'Huge', 'Small', 'Massive'],
        correct_answer: 2,
        difficulty: 'easy',
        explanation: 'Small is an antonym for big.',
      },
      {
        question: 'What is a verb?',
        options: ['A naming word', 'An action word', 'A descriptive word', 'A connecting word'],
        correct_answer: 1,
        difficulty: 'easy',
        explanation: 'A verb is a word that describes an action or state of being.',
      },
      {
        question: 'What is the correct spelling?',
        options: ['Occured', 'Occurred', 'Occured', 'Ocurred'],
        correct_answer: 1,
        difficulty: 'medium',
        explanation: 'The correct spelling is "Occurred" (double c, double r).',
      },
      {
        question: 'Which is a preposition?',
        options: ['Run', 'Happy', 'Under', 'Quickly'],
        correct_answer: 2,
        difficulty: 'medium',
        explanation: 'Under is a preposition (shows relationship between words).',
      },
    ];

    // Insert all questions
    const questionSets = [
      { id: jsTopicId, questions: jsQuestions },
      { id: pythonTopicId, questions: pythonQuestions },
      { id: gkTopicId, questions: gkQuestions },
      { id: aptTopicId, questions: aptQuestions },
      { id: dsTopicId, questions: dsQuestions },
      { id: htmlCssTopicId, questions: htmlCssQuestions },
      { id: reactTopicId, questions: reactQuestions },
      { id: sqlTopicId, questions: sqlQuestions },
      { id: mathTopicId, questions: mathQuestions },
      { id: englishTopicId, questions: englishQuestions },
    ];

    for (const set of questionSets) {
      for (const q of set.questions) {
        await query(
          `INSERT INTO questions (topic_id, question, options, correct_answer, difficulty, explanation)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [set.id, q.question, JSON.stringify(q.options), q.correct_answer, q.difficulty, q.explanation]
        );
      }
    }

    console.log('✅ Questions seeded');
    console.log('🎉 Database seeding complete! 10 topics with 100 questions added.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};