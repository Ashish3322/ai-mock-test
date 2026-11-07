package com.aiinterview.prep.config;

import com.aiinterview.prep.entity.*;
import com.aiinterview.prep.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewResponseRepository responseRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Autowired
    public DataInitializer(RoleRepository roleRepository,
                           QuestionRepository questionRepository,
                           UserRepository userRepository,
                           InterviewSessionRepository sessionRepository,
                           InterviewResponseRepository responseRepository,
                           FeedbackRepository feedbackRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.responseRepository = responseRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void run(String... args) {
        logger.info("Checking database initialization...");
        initRolesAndQuestions();
        initUsersAndSampleSession();
        logger.info("Database initialization check complete.");
    }

    private void initRolesAndQuestions() {
        if (roleRepository.count() > 0) {
            logger.info("Roles and questions already exist. Skipping seed.");
            return;
        }

        logger.info("Seeding roles and comprehensive question bank...");

        // 1. Java Developer
        Role javaDev = roleRepository.save(new Role(
                "Java Developer",
                "java-developer",
                "Core Java, OOPs, Collections, Multithreading, Spring Boot, Microservices & JVM performance tuning.",
                "coffee",
                "Medium"
        ));

        // 2. Frontend Developer
        Role frontendDev = roleRepository.save(new Role(
                "Frontend Developer",
                "frontend-developer",
                "React, TypeScript, CSS architecture, DOM manipulation, state management & web performance.",
                "layout",
                "Medium"
        ));

        // 3. Backend Developer
        Role backendDev = roleRepository.save(new Role(
                "Backend Developer",
                "backend-developer",
                "Distributed systems, REST APIs, databases, caching, concurrency & system design.",
                "server",
                "Hard"
        ));

        // 4. Full Stack Developer
        Role fullstackDev = roleRepository.save(new Role(
                "Full Stack Developer",
                "fullstack-developer",
                "End-to-end web applications, modern UI frameworks, backend microservices, DBs & deployment.",
                "layers",
                "Hard"
        ));

        // 5. Python Developer
        Role pythonDev = roleRepository.save(new Role(
                "Python Developer",
                "python-developer",
                "Python internals, OOP, Django/FastAPI, data manipulation, generators & asyncio.",
                "code",
                "Medium"
        ));

        // 6. Data Analyst
        Role dataAnalyst = roleRepository.save(new Role(
                "Data Analyst",
                "data-analyst",
                "SQL query optimization, data cleaning, statistical modeling, Pandas & dashboard insights.",
                "bar-chart",
                "Medium"
        ));

        // 7. Software Engineer
        Role softwareEng = roleRepository.save(new Role(
                "Software Engineer",
                "software-engineer",
                "Data structures, algorithms, object-oriented design, problem solving & clean code practices.",
                "cpu",
                "Medium"
        ));

        // 8. HR / Behavioral
        Role hrRole = roleRepository.save(new Role(
                "HR / Behavioral",
                "hr-behavioral",
                "STAR technique, leadership principles, conflict resolution, situational judgment & career goals.",
                "users",
                "Easy"
        ));

        // 9. Flutter Developer
        Role flutterDev = roleRepository.save(new Role(
                "Flutter Developer",
                "flutter-developer",
                "Cross-platform mobile apps, Flutter framework, Dart isolates, Widget architecture, Riverpod/Bloc & native platform channels.",
                "smartphone",
                "Medium"
        ));

        // Questions for Java Developer
        saveQ(javaDev, "Technical", "Explain the difference between HashMap and Hashtable in Java.", "Medium",
                "thread safety, synchronized, null keys, performance, fail-fast iterator",
                "HashMap is non-synchronized, allows one null key and multiple null values, and is faster. Hashtable is legacy, synchronized, thread-safe, and does not allow null keys or values.");

        saveQ(javaDev, "Technical", "How does Garbage Collection work in Java and what are generational GC concepts?", "Hard",
                "JVM, Eden, Survivor spaces, Tenured, Stop-the-world, G1, Mark and Sweep",
                "Java GC manages heap memory automatically using generational hypothesis: Young Generation (Eden + Survivor spaces) for short-lived objects, and Old Generation for long-lived objects.");

        saveQ(javaDev, "Coding", "What is the contract between equals() and hashCode() in Java?", "Medium",
                "hashCode, equals, consistency, HashMap buckets, collision",
                "If two objects are equal according to equals(), they must produce the same integer hashCode. If two objects have the same hashCode, they are not necessarily equal (hash collision).");

        saveQ(javaDev, "Database", "What is Spring Data JPA and how does dirty checking work?", "Medium",
                "Hibernate, EntityManager, Persistence Context, transaction commit, flush",
                "Spring Data JPA abstracts Hibernate persistence. During a transaction, entities loaded into persistence context are snapshot; upon commit, dirty checking compares snapshots and issues SQL updates automatically.");

        // Questions for Frontend Developer
        saveQ(frontendDev, "Technical", "Explain the Virtual DOM in React and how the reconciliation algorithm works.", "Medium",
                "Virtual DOM, diffing algorithm, fiber, reconciliation, state updates, rerendering",
                "The Virtual DOM is an in-memory representation of real DOM elements. When state changes, React creates a new VDOM tree, diffs it with the previous tree (reconciliation), and batches minimal real DOM updates.");

        saveQ(frontendDev, "Technical", "What is the difference between useEffect, useLayoutEffect, and useMemo?", "Medium",
                "side effects, asynchronous, DOM paint, memoization, render cycle",
                "useEffect runs asynchronously after browser paint for side effects; useLayoutEffect runs synchronously immediately after DOM mutations before browser paint; useMemo memoizes computed values.");

        saveQ(frontendDev, "Technical", "Explain CSS Box Model and how box-sizing: border-box alters layout calculation.", "Easy",
                "content, padding, border, margin, border-box, width calculation",
                "The CSS Box Model consists of content, padding, border, and margin. Default content-box excludes padding and border from specified width, while border-box includes padding and border within the declared width.");

        saveQ(frontendDev, "Coding", "What is Event Bubbling and Event Delegation in JavaScript?", "Medium",
                "event propagation, capturing, bubbling, parent listener, event target",
                "Event bubbling is where an event triggers on the deepest target and propagates up through ancestor elements. Event delegation leverages bubbling by placing a single listener on a parent element.");

        // Questions for Backend Developer
        saveQ(backendDev, "System Design", "How would you design a scalable URL shortener like Bitly?", "Hard",
                "Base62 encoding, hashing, database sharding, caching, Redis, rate limiting, collision resolution",
                "Key components: API gateway, URL generation service using Base62 or auto-incrementing ID with distributed unique ID generator (e.g. Snowflake), Redis caching layer with LRU eviction, and horizontally partitioned NoSQL/SQL storage.");

        saveQ(backendDev, "Database", "Explain database indexing: B-Trees vs Hash Indexes and when to use each.", "Medium",
                "B-Tree, Hash index, range queries, exact lookups, clustered index, O(log N)",
                "B-Tree indexes maintain sorted order, making them ideal for range queries, sorting, and prefix matching with O(log N) lookup. Hash indexes offer O(1) point lookups but do not support range scans.");

        saveQ(backendDev, "Technical", "What are the core differences between Monolithic and Microservices architectures?", "Medium",
                "scalability, deployment, network overhead, database per service, fault isolation",
                "A monolith packages all business modules into a single deployable unit. Microservices decompose functionality into independently deployable, loosely coupled services communicating via APIs/queues.");

        saveQ(backendDev, "Technical", "How does JWT authentication work and how do you handle token revocation?", "Medium",
                "header, payload, signature, stateless, secret key, blacklist, refresh token",
                "JWT contains base64 encoded header, payload and HMAC/RSA signature verified by server without database hit. Revocation is handled via short expiry with refresh tokens, or a Redis blacklist of revoked JTI tokens.");

        // Questions for Full Stack Developer
        saveQ(fullstackDev, "Technical", "Explain how CORS (Cross-Origin Resource Sharing) works and how preflight requests are handled.", "Medium",
                "same-origin policy, OPTIONS request, Access-Control-Allow-Origin, headers, browser security",
                "CORS is a browser security mechanism that restricts cross-origin HTTP requests. For non-simple requests, browsers send an HTTP OPTIONS preflight request before sending the actual request.");

        saveQ(fullstackDev, "System Design", "Describe the flow of a modern full-stack web application from DNS lookup to database query.", "Hard",
                "DNS resolution, TLS handshake, CDN, Load Balancer, Nginx reverse proxy, Backend API, ORM, Database",
                "Client types URL -> DNS resolves IP -> TCP/TLS handshake -> CDN serves static assets -> API requests hit Reverse Proxy/LB -> routed to Spring Boot backend -> auth verified -> ORM queries DB -> JSON returned -> React renders UI.");

        saveQ(fullstackDev, "Technical", "What are SQL vs NoSQL databases and how do you choose between them for a web project?", "Medium",
                "ACID, schema, horizontal scaling, relational, document store, consistency, availability",
                "SQL provides ACID transactions, rigid schemas, and complex joins, ideal for financial and structured domain models. NoSQL provides flexible schemas and horizontal scalability, ideal for unstructured data and high write throughput.");

        // Questions for Python Developer
        saveQ(pythonDev, "Technical", "Explain Python's GIL (Global Interpreter Lock) and how it affects multithreading.", "Medium",
                "GIL, CPython, CPU-bound, I/O-bound, multiprocessing, thread safety",
                "The Global Interpreter Lock is a mutex in CPython that allows only one thread to execute Python bytecode at a time. It prevents true parallel execution in CPU-bound tasks, where multiprocessing is preferred.");

        saveQ(pythonDev, "Coding", "What is the difference between generators and regular functions in Python?", "Easy",
                "yield, lazy evaluation, memory efficiency, iterator protocol, next()",
                "Generators use the yield keyword to return values lazily one by one, preserving execution state between calls and consuming minimal memory compared to returning a full list.");

        saveQ(pythonDev, "Technical", "Explain Python decorators and how they work under the hood.", "Medium",
                "higher-order function, closures, @syntax, wrapper, functools.wraps",
                "A decorator is a higher-order function that takes another function as an argument, extends or alters its behavior without modifying it directly, and returns a callable wrapper.");

        // Questions for Data Analyst
        saveQ(dataAnalyst, "Database", "What are SQL Window Functions and how do ROW_NUMBER(), RANK(), and DENSE_RANK() differ?", "Medium",
                "OVER clause, PARTITION BY, ORDER BY, tie handling, gap in numbering",
                "Window functions perform calculations across a set of table rows related to the current row. ROW_NUMBER assigns unique sequential integers. RANK assigns same rank to ties with gaps, while DENSE_RANK assigns same rank without gaps.");

        saveQ(dataAnalyst, "Technical", "How do you detect and handle missing data and outliers in a dataset?", "Medium",
                "imputation, mean, median, IQR method, z-score, deletion, domain context",
                "Missing data can be handled via deletion or imputation (mean/median for numeric, mode for categorical). Outliers are detected using IQR (1.5 * IQR) or Z-score (> 3 standard deviations) and capped or investigated.");

        saveQ(dataAnalyst, "Technical", "Explain the difference between Correlation and Causation with a practical example.", "Easy",
                "correlation coefficient, confounding variables, causal inference, A/B testing",
                "Correlation indicates a statistical association between two variables, while Causation proves that change in one directly causes change in the other. Ice cream sales and drowning rates correlate due to temperature, but one does not cause the other.");

        // Questions for Software Engineer
        saveQ(softwareEng, "Technical", "Explain the SOLID principles of Object-Oriented Design.", "Medium",
                "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
                "SOLID encompasses: Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable), Interface Segregation (lean interfaces), and Dependency Inversion (depend on abstractions).");

        saveQ(softwareEng, "Coding", "Explain the time and space complexity of QuickSort vs MergeSort.", "Medium",
                "O(N log N), worst case O(N^2), in-place, divide and conquer, auxiliary memory",
                "MergeSort has guaranteed O(N log N) time complexity and O(N) auxiliary space. QuickSort has O(N log N) average time and O(log N) space, but O(N^2) worst case when poorly pivoted.");

        saveQ(softwareEng, "Technical", "What is Deadlock in operating systems and what four conditions must hold for it to occur?", "Hard",
                "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
                "Deadlock occurs when processes are unable to proceed because each holds a resource while waiting for another held by another process. Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.");

        // Questions for HR / Behavioral
        saveQ(hrRole, "Behavioral", "Tell me about a time you faced a difficult conflict with a team member and how you resolved it.", "Easy",
                "STAR method, Situation, Task, Action, Result, active listening, collaboration",
                "Use the STAR method: Describe the specific conflict situation, your objective, your constructive communication and empathy-based action, and the positive result for the project and relationship.");

        saveQ(hrRole, "Behavioral", "Describe a challenging technical problem you encountered where you failed initially. What did you learn?", "Easy",
                "resilience, root cause analysis, ownership, continuous learning, adaptability",
                "Structure your answer with humility: define the failure, take ownership, describe your analytical pivots and solution, and conclude with the concrete lessons learned.");

        saveQ(hrRole, "HR", "Why do you want to join our organization and where do you see yourself in 3 years?", "Easy",
                "company alignment, growth mindset, technical mastery, mentorship, value creation",
                "Connect your passion for the company's domain and engineering culture to your personal milestones: mastering core tech, mentoring peers, and driving impactful customer solutions.");

        // Questions for Flutter Developer
        saveQ(flutterDev, "Technical", "Explain the relationship between the Widget Tree, Element Tree, and RenderObject Tree in Flutter.", "Hard",
                "Widget immutability, Element lifecycle, RenderObject layout and paint, reconciliation, build efficiency",
                "In Flutter, rendering is achieved through three distinct, coordinated trees:\n\n1. Widget Tree: Widgets are immutable configurations or blueprints. Because creating widgets is extremely lightweight, Flutter rebuilds parts of this tree frequently on state change.\n\n2. Element Tree: Elements represent the runtime instantiation of widgets and manage lifecycle state. When a widget rebuilds, Flutter compares the old and new widget types and keys using canUpdate(). If identical, it updates the existing element rather than recreating it, avoiding expensive overhead.\n\n3. RenderObject Tree: RenderObjects handle the actual layout sizing (box constraints, performLayout) and painting (Canvas, Paint) on screen. They are persistent and expensive to create, so the Element tree recycles RenderObjects whenever possible. This three-tree separation allows Flutter to achieve smooth 60-120 FPS UI updates.");

        saveQ(flutterDev, "Technical", "What is the difference between StatefulWidget, StatelessWidget, and InheritedWidget in Flutter? When would you use InheritedWidget?", "Medium",
                "Stateless vs Stateful, State object lifecycle, InheritedWidget data propagation, of(context) lookup, O(1) context dependency",
                "StatelessWidget is immutable and does not hold mutable state over time; its build() method depends solely on constructor arguments.\n\nStatefulWidget creates a companion State object that survives widget rebuilds, allowing mutable values to trigger UI updates via setState().\n\nInheritedWidget is a specialized base widget that allows data to efficiently propagate down the widget tree without manual prop drilling. Descendant widgets register dependencies by subscribing to it via BuildContext.dependOnInheritedWidgetOfExactType(), enabling O(1) ancestor lookups and notifying only dependent descendants when the data updates. Popular state libraries like Provider and Riverpod build on this concept.");

        saveQ(flutterDev, "Architecture", "How do Dart isolates work, and how does Flutter achieve multithreading without shared memory?", "Hard",
                "single-threaded event loop, isolates, microtask queue, ReceivePort, SendPort, compute() function, background tasks",
                "Dart code runs in a single-threaded execution context backed by an Event Loop with two queues: the Microtask Queue and the Event Queue.\n\nTo perform heavy CPU-bound computation (such as large JSON parsing or image filtering) without stuttering the UI thread, Dart uses Isolates. Unlike traditional OS threads, Isolates do not share memory heap with each other, completely preventing race conditions and deadlocks. Communication between Isolates occurs purely via asynchronous message passing through SendPort and ReceivePort. Flutter provides the compute() helper function to easily offload intensive tasks to a worker isolate and return the result.");

        saveQ(flutterDev, "Coding", "How does Flutter communicate with native Android (Kotlin/Java) and iOS (Swift/Objective-C) platforms?", "Medium",
                "MethodChannel, EventChannel, BasicMessageChannel, binary messenger, asynchronous platform calls",
                "Flutter bridges to native platform APIs using Platform Channels:\n\n1. MethodChannel: Designed for asynchronous method invocation (calling a native method with arguments and awaiting a return value, or vice-versa). Messages are serialized into binary buffers using standard message codecs.\n\n2. EventChannel: Designed for streaming continuous data from native code to Flutter (e.g. sensor readings, GPS location updates, battery percentage changes).\n\n3. BasicMessageChannel: Used for custom semi-structured or continuous message exchange with custom codecs.\n\nCalls through MethodChannels are non-blocking, ensuring the Flutter UI continues rendering smoothly while waiting for native platform responses.");

        saveQ(flutterDev, "Optimization", "What are best practices for optimizing rendering performance and eliminating frame drops (jank) in a Flutter application?", "Medium",
                "const constructors, RepaintBoundary, ListView.builder, avoiding unnecessary rebuilds, DevTools performance profiler",
                "Key practices for eliminating frame drops in Flutter include:\n\n1. Use const constructors aggressively: Marks widgets as immutable singletons, allowing Flutter to short-circuit rebuilds.\n2. Use ListView.builder() or CustomScrollView instead of ListView(children: ...): Lazily builds only items currently visible on screen.\n3. Isolate state changes with small consumer widgets or ValueListenableBuilder: Avoid calling setState() high in the tree.\n4. Wrap complex or animated widgets in RepaintBoundary: Prevents expensive re-painting of unaffected parent or child subtrees.\n5. Offload CPU-heavy computation to worker isolates via compute().\n6. Avoid heavy operations or I/O inside build() methods.");
    }

    private void saveQ(Role role, String category, String text, String difficulty, String expected, String answer) {
        questionRepository.save(new Question(role, category, text, difficulty, expected, answer));
    }

    private void initUsersAndSampleSession() {
        if (userRepository.count() > 0) {
            return;
        }

        logger.info("Seeding admin and student users...");

        // Admin User
        User admin = new User();
        admin.setName("Admin Manager");
        admin.setEmail("admin@aiinterview.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ROLE_ADMIN");
        admin.setTargetRole("Platform Architect");
        userRepository.save(admin);

        // Student User
        User student = new User();
        student.setName("Ashish Kumar");
        student.setEmail("student@aiinterview.com");
        student.setPassword(passwordEncoder.encode("student123"));
        student.setRole("ROLE_STUDENT");
        student.setTargetRole("Java Developer");
        User savedStudent = userRepository.save(student);

        // Create a pre-completed sample interview session for student so dashboard is immediately rich
        Optional<Role> javaRoleOpt = roleRepository.findBySlug("java-developer");
        if (javaRoleOpt.isPresent()) {
            Role javaRole = javaRoleOpt.get();
            List<Question> questions = questionRepository.findByRoleIdAndActiveTrue(javaRole.getId());
            if (!questions.isEmpty()) {
                InterviewSession session = new InterviewSession();
                session.setUser(savedStudent);
                session.setRole(javaRole);
                session.setDifficulty("Medium");
                session.setTotalQuestions(3);
                session.setCurrentQuestionIndex(3);
                session.setStatus("COMPLETED");
                session.setOverallScore(82.0);
                session.setCorrectnessAvg(8.2);
                session.setRelevanceAvg(8.6);
                session.setCompletenessAvg(7.8);
                session.setClarityAvg(8.4);
                session.setOverallRecommendation("Outstanding performance! You are interview-ready for Java Developer roles. Focus on maintaining consistency and tackling senior-level concurrency nuances.");
                session.setStartedAt(LocalDateTime.now().minusDays(1));
                session.setCompletedAt(LocalDateTime.now().minusDays(1).plusMinutes(18));
                InterviewSession savedSession = sessionRepository.save(session);

                for (int i = 0; i < Math.min(3, questions.size()); i++) {
                    Question q = questions.get(i);
                    InterviewResponse resp = new InterviewResponse();
                    resp.setSession(savedSession);
                    resp.setQuestion(q);
                    resp.setCandidateAnswer("HashMap is non-synchronized and faster, allowing one null key. Hashtable is synchronized and thread safe.");
                    resp.setTimeTakenSeconds(45);
                    resp.setScore(8);
                    resp.setCorrectness(8);
                    resp.setRelevance(9);
                    resp.setCompleteness(7);
                    resp.setClarity(8);
                    resp.setSubmittedAt(LocalDateTime.now().minusDays(1).plusMinutes(5 + i * 4));

                    Feedback fb = new Feedback();
                    fb.setResponse(resp);
                    fb.setStrengths("[\"Good conceptual understanding\", \"Correct key points regarding synchronization and null values\"]");
                    fb.setWeaknesses("[\"Add practical code examples\", \"Explain internal bucket hashing more clearly\"]");
                    fb.setFeedbackText("Your answer demonstrates a solid grasp of Java collections. You correctly articulated the difference in synchronization and null key support.");

                    resp.setFeedback(fb);
                    responseRepository.save(resp);
                }
            }
        }

        logger.info("Admin and student users seeded successfully.");
    }
}
