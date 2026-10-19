package com.aiinterview.prep.controller;

import com.aiinterview.prep.entity.McqQuestion;
import com.aiinterview.prep.repository.McqQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class McqController {

    public record McqItemDto(
            Long id,
            String track,
            String category,
            String difficulty,
            String question,
            String codeSnippet,
            List<String> options,
            int correctAnswerIndex,
            String explanation,
            Boolean active
    ) {
        public static McqItemDto fromEntity(McqQuestion q) {
            return new McqItemDto(
                    q.getId(),
                    q.getTrack(),
                    q.getCategory(),
                    q.getDifficulty(),
                    q.getQuestion(),
                    q.getCodeSnippet(),
                    q.getOptions(),
                    q.getCorrectAnswerIndex(),
                    q.getExplanation(),
                    q.getActive()
            );
        }
    }

    public record TrackInfo(
            String id,
            String name,
            String icon,
            String description,
            long questionCount
    ) {}

    public record VerifyRequest(
            Long questionId,
            int selectedIndex
    ) {}

    public record VerifyResponse(
            boolean correct,
            int correctAnswerIndex,
            String explanation
    ) {}

    public record CreateMcqRequest(
            String track,
            String category,
            String difficulty,
            String question,
            String codeSnippet,
            String optionA,
            String optionB,
            String optionC,
            String optionD,
            int correctAnswerIndex,
            String explanation
    ) {}

    private final McqQuestionRepository mcqRepo;

    @Autowired
    public McqController(McqQuestionRepository mcqRepo) {
        this.mcqRepo = mcqRepo;
        initSeedQuestionsIfEmpty();
    }

    private void initSeedQuestionsIfEmpty() {
        if (mcqRepo.count() > 0) {
            return;
        }

        List<McqQuestion> seed = new ArrayList<>();

        // === 1. JAVA & OOPS ===
        seed.add(new McqQuestion("java", "Core Java", "Medium",
                "What will be the output of the following Java code snippet?",
                "String s1 = \"Hello\";\nString s2 = new String(\"Hello\");\nString s3 = s2.intern();\nSystem.out.println((s1 == s2) + \" \" + (s1 == s3));",
                "true true", "false true", "false false", "true false", 1,
                "s1 references the pool object. s2 references a heap object, so (s1 == s2) is false. Calling intern() returns the pool object matching s1, making (s1 == s3) true."));

        seed.add(new McqQuestion("java", "OOP Concepts", "Easy",
                "Which SOLID principle states that high-level modules should not depend on low-level modules, but both should depend on abstractions?",
                null,
                "Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle", "Dependency Inversion Principle", 3,
                "The Dependency Inversion Principle (DIP) states that high-level business logic should depend on abstractions (interfaces) rather than concrete low-level implementations."));

        seed.add(new McqQuestion("java", "Concurrency", "Hard",
                "How does ConcurrentHashMap in Java 8+ achieve high concurrency without locking the whole table?",
                null,
                "Locks the entire array per read", "Uses CAS for empty buckets and synchronizes only on bucket head nodes", "Clones array on every write", "Uses global ReentrantLock", 1,
                "Java 8+ ConcurrentHashMap uses CAS for insertions into empty buckets and locks only the individual head node for bucket collisions, enabling fully non-blocking reads."));

        seed.add(new McqQuestion("java", "JVM & Memory", "Medium",
                "Where are Java 8+ static class variables stored?",
                null,
                "PermGen space", "JVM Stack frame", "Metaspace (native memory)", "Java Heap (attached to the Class object)", 3,
                "PermGen was removed in Java 8. While metadata resides in Metaspace, static variables and interned Strings are stored directly in the Java Heap inside the java.lang.Class instance."));

        seed.add(new McqQuestion("java", "Generics", "Medium",
                "What is type erasure in Java Generics?",
                null,
                "Generics are resolved at hardware level", "The compiler replaces generic types with their upper bound or Object at compile time", "A runtime memory leak in ArrayList", "Type safety enforced strictly by the CPU", 1,
                "Type erasure ensures backward compatibility by stripping out parameterized type information during compilation and inserting appropriate casts where needed."));

        seed.add(new McqQuestion("java", "Exception Handling", "Easy",
                "Which of the following is an unchecked (Runtime) exception in Java?",
                null,
                "IOException", "SQLException", "NullPointerException", "ClassNotFoundException", 2,
                "NullPointerException extends RuntimeException, meaning the compiler does not mandate catching or declaring it in a throws clause."));

        seed.add(new McqQuestion("java", "Streams API", "Medium",
                "What is the output of: Stream.of(\"a\", \"b\", \"c\").filter(s -> { System.out.print(s); return true; });",
                null,
                "abc", "Nothing is printed", "Throws IllegalStateException", "a", 1,
                "Streams in Java are lazily evaluated. Without a terminal operation (like .collect() or .forEach()), intermediate operations such as .filter() never execute."));

        // === 2. FRONTEND & REACT ===
        seed.add(new McqQuestion("react", "React Hooks", "Medium",
                "What happens when you return a function from the useEffect hook in React?",
                "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
                "Creates infinite loop", "Registers a cleanup function called on unmount or before the effect re-runs", "Forces an immediate sync re-render", "Throws StrictMode warning", 1,
                "Returning a function from useEffect defines a cleanup callback that React runs prior to unmounting or before applying the effect on subsequent dependency updates."));

        seed.add(new McqQuestion("react", "JavaScript Event Loop", "Medium",
                "What is the logged order in this JavaScript code?",
                "console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
                "1, 2, 3, 4", "1, 4, 2, 3", "1, 4, 3, 2", "1, 3, 4, 2", 2,
                "Synchronous code runs first (1, 4). Microtasks (Promise.then) run next (3). Macrotasks (setTimeout) execute in the next tick (2)."));

        seed.add(new McqQuestion("react", "Performance", "Hard",
                "What is the key difference between useMemo and useCallback in React?",
                null,
                "useMemo memoizes values; useCallback memoizes function instances", "useMemo is async; useCallback is sync", "useCallback is for Redux only", "There is no difference", 0,
                "useMemo caches the calculated result of a function call. useCallback caches the function instance itself to prevent unnecessary child re-renders."));

        seed.add(new McqQuestion("react", "CSS Flexbox", "Easy",
                "In CSS Flexbox, which property controls alignment along the main axis?",
                null,
                "align-items", "justify-content", "flex-wrap", "align-content", 1,
                "justify-content defines the alignment along the main axis, while align-items aligns items along the cross axis."));

        seed.add(new McqQuestion("react", "React 19 & State", "Medium",
                "In React, why should component state never be mutated directly (e.g. state.push(x))?",
                null,
                "It causes syntax error", "React uses Object.is shallow comparison to detect state changes and trigger re-renders", "Direct mutation clears the DOM", "Immutable objects are required by the browser", 1,
                "React compares previous and next state references using Object.is. Direct in-place mutation leaves the reference identical, preventing React from triggering a re-render."));

        seed.add(new McqQuestion("react", "Virtual DOM", "Easy",
                "Why does React use the 'key' prop when rendering lists of elements?",
                null,
                "To set CSS styles", "To uniquely identify list nodes for efficient reconciliation and DOM diffing", "To encrypt user data", "To sort arrays alphabetically", 1,
                "Keys give list items stable identities, allowing React's reconciliation algorithm to determine which items were added, removed, or reordered efficiently."));

        seed.add(new McqQuestion("react", "TypeScript", "Medium",
                "What is the difference between 'type' and 'interface' in TypeScript?",
                null,
                "Interfaces can be merged via declaration merging; types cannot", "Types can only represent numbers", "Interfaces do not support objects", "There are zero differences", 0,
                "Interfaces in TypeScript support declaration merging (multiple declarations with the same name combine), whereas type aliases cannot be reopened once declared."));

        // === 3. PYTHON ===
        seed.add(new McqQuestion("python", "Internals", "Medium",
                "What is the output of the following Python function?",
                "def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))",
                "[1] then [2]", "[1] then [1, 2]", "Error: mutable default disallowed", "[1, 2] then [1, 2]", 1,
                "Python evaluates default arguments once when the function is defined. Because lists are mutable, all invocations share the same list instance."));

        seed.add(new McqQuestion("python", "Concurrency", "Hard",
                "What is the primary role of the Global Interpreter Lock (GIL) in CPython?",
                null,
                "Allocates CPU cores", "Ensures only one native thread executes Python bytecode at a time", "Manages disk I/O", "Secures network sockets", 1,
                "The CPython GIL prevents thread-unsafe memory corruption in reference counting by allowing only one native thread to execute Python bytecode at a time."));

        seed.add(new McqQuestion("python", "Data Structures", "Easy",
                "What is the average time complexity of checking membership ('x in s') in a Python set?",
                null,
                "O(1)", "O(log n)", "O(n)", "O(n log n)", 0,
                "Python sets use hash tables. Under normal hash distribution, lookup and membership checks execute in O(1) constant time."));

        seed.add(new McqQuestion("python", "Decorators", "Medium",
                "What is a Python decorator fundamentally?",
                null,
                "A CSS styling class", "A function that takes another function as an argument and returns an extended function", "A database trigger", "A garbage collector hook", 1,
                "A decorator is a callable that accepts a function object, wraps or modifies its behavior, and returns the modified or new function."));

        seed.add(new McqQuestion("python", "Generators", "Medium",
                "What is the difference between a return statement and a yield statement in Python?",
                null,
                "yield returns a value and suspends function state; return terminates execution", "return generates an iterator", "yield only works with numbers", "There is no functional difference", 0,
                "yield produces a value and pauses the function's execution state, allowing subsequent values to be generated on demand without storing the entire sequence in memory."));

        seed.add(new McqQuestion("python", "OOP", "Easy",
                "Which dunder method is called when an object is initialized in Python?",
                null,
                "__start__", "__init__", "__create__", "__construct__", 1,
                "__init__ is the standard constructor/initializer method automatically invoked when a new instance of a class is created."));

        // === 4. DATABASE & SQL ===
        seed.add(new McqQuestion("database", "SQL Queries", "Medium",
                "What is the core difference between the WHERE and HAVING clauses in SQL?",
                null,
                "WHERE is MySQL only", "WHERE filters rows before aggregation; HAVING filters groups after aggregation", "HAVING cannot use comparison operators", "WHERE only works on numeric data", 1,
                "WHERE filters individual records prior to GROUP BY. HAVING filters grouped rows returned by aggregate functions like COUNT, SUM, or AVG."));

        seed.add(new McqQuestion("database", "ACID", "Hard",
                "Which SQL transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads?",
                null,
                "Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable", 2,
                "Repeatable Read guarantees rows read cannot change during the transaction. However, newly inserted matching rows (phantoms) can still appear in subsequent queries."));

        seed.add(new McqQuestion("database", "Indexing", "Medium",
                "Why do relational databases use B+ Trees instead of standard Binary Search Trees for indexes?",
                null,
                "B+ Trees have fewer nodes", "B+ Trees have high fan-out (reducing disk I/O) and linked leaf nodes for fast sequential range queries", "BSTs cannot store text", "B+ Trees run entirely in CPU cache", 1,
                "B+ Trees minimize disk reads through high branching factors (shallow trees) and allow efficient range scanning via doubly linked leaf pages."));

        seed.add(new McqQuestion("database", "Normalization", "Easy",
                "What requirement distinguishes 2nd Normal Form (2NF) from 1st Normal Form (1NF)?",
                null,
                "No transitive dependencies", "Elimination of partial functional dependencies on composite primary keys", "Atomic column values", "All tables must have foreign keys", 1,
                "2NF requires that the table is in 1NF and every non-prime attribute is fully functionally dependent on the entire primary key, not a subset."));

        seed.add(new McqQuestion("database", "Joins", "Easy",
                "Which JOIN returns all records from the left table and matched records from the right table?",
                null,
                "INNER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "RIGHT OUTER JOIN", 1,
                "LEFT JOIN returns all rows from the left table, with NULL values in the right table's columns if no match exists."));

        seed.add(new McqQuestion("database", "Optimization", "Medium",
                "What is an index scan vs an index seek in database query execution?",
                null,
                "They are synonyms", "Seek navigates directly to matching rows using tree traversal; Scan reads through the entire index leaf sequence", "Scan is always faster", "Seek only works with primary keys", 1,
                "An index seek uses b-tree navigation to jump directly to specific target rows (O(log N)), whereas an index scan traverses through pages of the index."));

        // === 5. BACKEND & SYSTEM DESIGN ===
        seed.add(new McqQuestion("backend", "HTTP & REST", "Easy",
                "Which HTTP method is idempotent and intended to completely replace a target resource?",
                null,
                "POST", "PATCH", "PUT", "DELETE", 2,
                "PUT is idempotent (multiple identical calls produce the identical end state) and semantically replaces the complete representation of the resource."));

        seed.add(new McqQuestion("backend", "Distributed Systems", "Medium",
                "In the CAP theorem, what trade-off must distributed systems make during a network partition (P)?",
                null,
                "Between Consistency (C) and Availability (A)", "Between Performance and Security", "Between Latency and Storage", "All three can be guaranteed simultaneously", 0,
                "When a network partition (P) occurs, the system must choose between returning consistent data or remaining available to incoming requests."));

        seed.add(new McqQuestion("backend", "Caching", "Hard",
                "In the Cache-Aside (Lazy Loading) caching pattern, what occurs on a cache miss?",
                null,
                "Throws error to client", "Application reads from database, writes result into cache, and returns it to caller", "Database triggers background push", "Reverse proxy intercepts request", 1,
                "On a cache miss, the service queries the datastore, populates the cache with a defined TTL, and returns the fetched response to the requester."));

        seed.add(new McqQuestion("backend", "Message Queues", "Medium",
                "What is the primary advantage of using a message broker (e.g. Kafka, RabbitMQ) in a microservices architecture?",
                null,
                "Replaces relational databases", "Decouples services asynchronously and buffers traffic spikes", "Removes need for API gateways", "Eliminates network latency", 1,
                "Message queues decouple producers and consumers, enabling asynchronous processing, fault tolerance, and smoothing out unpredictable traffic surges."));

        seed.add(new McqQuestion("backend", "Authentication", "Medium",
                "What is the purpose of the signature in a JSON Web Token (JWT)?",
                null,
                "To encrypt payload contents", "To verify that the token was not tampered with and was issued by a trusted party", "To compress the token size", "To store user passwords", 1,
                "The JWT signature is computed using a secret key over the header and payload. It verifies data integrity and sender authenticity without requiring database lookups."));

        seed.add(new McqQuestion("backend", "Resilience", "Medium",
                "What is the purpose of the Circuit Breaker pattern in microservices?",
                null,
                "Encrypts RPC payloads", "Prevents cascading failures by failing fast when a downstream service is unhealthy", "Increases database write speed", "Compresses HTTP bodies", 1,
                "A circuit breaker detects failures in dependent services and temporarily trips open, returning fallback responses instead of exhausting thread pools waiting for timeouts."));

        // === 6. APTITUDE & LOGICAL REASONING ===
        seed.add(new McqQuestion("aptitude", "Time & Distance", "Medium",
                "A train 240 meters long passes a pole in 24 seconds. How long will it take to pass a platform 650 meters long?",
                null,
                "65 seconds", "89 seconds", "100 seconds", "75 seconds", 1,
                "Speed = 240 m / 24 s = 10 m/s. Total distance to cross platform = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds."));

        seed.add(new McqQuestion("aptitude", "Probability", "Medium",
                "Two fair dice are thrown simultaneously. What is the probability of getting a sum divisible by 5?",
                null,
                "7/36", "1/6", "5/36", "1/4", 0,
                "Total outcomes = 36. Sums divisible by 5 are 5 and 10. Pairs for 5: (1,4), (2,3), (3,2), (4,1) = 4. Pairs for 10: (4,6), (5,5), (6,4) = 3. Total = 7. Probability = 7/36."));

        seed.add(new McqQuestion("aptitude", "Time & Work", "Easy",
                "A can complete a project in 12 days, and B can complete it in 24 days. Working together, how many days will they take?",
                null,
                "6 days", "8 days", "9 days", "10 days", 1,
                "1-day work = 1/12 + 1/24 = 3/24 = 1/8. Together they will finish in 8 days."));

        seed.add(new McqQuestion("aptitude", "Percentages", "Easy",
                "The price of an item is increased by 20% and then reduced by 20%. What is the net percentage change in price?",
                null,
                "0% (no change)", "4% decrease", "2% decrease", "4% increase", 1,
                "Assume initial price 100. After 20% increase: 120. After 20% reduction: 120 - 24 = 96. Net change = 4% decrease."));

        seed.add(new McqQuestion("aptitude", "Pipes & Cisterns", "Medium",
                "Pipe A can fill a tank in 6 hours, and Pipe B can empty it in 8 hours. If both pipes are opened together, how long will it take to fill the tank?",
                null,
                "14 hours", "20 hours", "24 hours", "18 hours", 2,
                "Net filling rate in 1 hour = 1/6 - 1/8 = (4 - 3)/24 = 1/24. The tank will be filled in 24 hours."));

        seed.add(new McqQuestion("aptitude", "Series & Sequences", "Easy",
                "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
                null,
                "40", "42", "44", "46", 1,
                "Differences are +4, +6, +8, +10. Next difference is +12. 30 + 12 = 42. (Or n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42)."));

        // === 7. C++ & LOW-LEVEL CONCEPTS ===
        seed.add(new McqQuestion("cpp", "Pointers & Memory", "Medium",
                "What is a dangling pointer in C++?",
                null,
                "A pointer initialized to nullptr", "A pointer pointing to a memory location that has been deallocated or freed", "A pointer with void type", "A smart pointer with multiple owners", 1,
                "A dangling pointer arises when an object is deleted or deallocated without modifying the pointer value, leaving it pointing to invalid memory."));

        seed.add(new McqQuestion("cpp", "Smart Pointers", "Hard",
                "Which C++ smart pointer allows only unique, exclusive ownership of a dynamically allocated resource?",
                null,
                "std::shared_ptr", "std::unique_ptr", "std::weak_ptr", "std::auto_ptr", 1,
                "std::unique_ptr manages the lifetime of an object through strict exclusive ownership; it cannot be copied, only moved via std::move()."));

        seed.add(new McqQuestion("cpp", "Virtual Functions", "Medium",
                "What mechanism does C++ use at runtime to achieve dynamic polymorphism?",
                null,
                "Template metaprogramming", "Virtual method table (vtable) and virtual table pointer (vptr)", "Inline function substitution", "Preprocessor macros", 1,
                "C++ compilers construct a virtual method table (vtable) for classes containing virtual functions. Each instance carries a hidden vptr pointing to its class vtable."));

        seed.add(new McqQuestion("cpp", "STL", "Easy",
                "What is the underlying data structure of std::vector in C++?",
                null,
                "Doubly linked list", "Dynamic contiguous array", "Binary search tree", "Hash table", 1,
                "std::vector wraps a dynamically sized contiguous array in heap memory, providing O(1) random access and amortized O(1) append operations."));

        seed.add(new McqQuestion("cpp", "Destructors", "Medium",
                "Why should base class destructors be declared 'virtual' in C++ when deleting via a base pointer?",
                null,
                "To increase heap speed", "To ensure the derived class destructor is invoked, preventing resource leaks", "It is required for compile", "To allocate vtable on the stack", 1,
                "If a base destructor is not virtual, calling delete on a base pointer to a derived instance invokes only the base destructor, leaking derived class resources."));

        // === 8. CLOUD, DEVOPS & GIT ===
        seed.add(new McqQuestion("cloud", "Docker & Containers", "Medium",
                "What is the fundamental difference between a Docker container and a Virtual Machine (VM)?",
                null,
                "Containers have separate OS kernels; VMs share the host kernel", "Containers share the host OS kernel and isolate user space; VMs run a full guest OS on a hypervisor", "Containers run only on Linux", "VMs consume less RAM than containers", 1,
                "Containers virtualize the operating system by sharing the host kernel through cgroups and namespaces, while VMs virtualize physical hardware via a hypervisor."));

        seed.add(new McqQuestion("cloud", "CI/CD", "Easy",
                "What does Continuous Integration (CI) primarily involve in modern software development?",
                null,
                "Deploying directly to production every hour", "Automatically building and running test suites whenever code changes are committed", "Rewriting legacy databases", "Manual peer reviews of compiled binaries", 1,
                "CI automates the merging, building, and automated testing of code branches to detect regressions and integration conflicts early."));

        seed.add(new McqQuestion("cloud", "Git Core", "Medium",
                "What is the difference between 'git merge' and 'git rebase'?",
                null,
                "git rebase deletes branches permanently", "git merge creates a merge commit preserving full history; git rebase rewrites commits onto the tip of another branch", "git merge is client-side only", "There is no functional difference", 1,
                "git merge retains complete chronological history with a merge commit. git rebase replays your commits atop the target branch, producing a clean linear project history."));

        seed.add(new McqQuestion("cloud", "Kubernetes", "Hard",
                "In Kubernetes, what is a Pod?",
                null,
                "A physical worker node", "The smallest deployable unit of computing that can contain one or more tightly coupled containers", "A cloud load balancer", "A persistent disk volume", 1,
                "A Pod represents a single instance of a running process in Kubernetes and can contain one or more tightly coupled containers sharing network and storage namespaces."));

        seed.add(new McqQuestion("cloud", "Serverless", "Easy",
                "In AWS Lambda or Serverless compute, what is a 'Cold Start'?",
                null,
                "Deploying code during winter months", "The latency incurred when launching a new execution environment container for an incoming invocation", "Rebooting a physical AWS datacenter", "A hardware cooling system fault", 1,
                "A cold start is the initialization delay that occurs when a serverless platform boots up a new container instance and downloads runtime code to handle an initial request."));

        mcqRepo.saveAll(seed);
    }

    // Public: Get all active questions with filters
    @GetMapping("/api/mcqs")
    public ResponseEntity<List<McqItemDto>> getQuestions(
            @RequestParam(required = false) String track,
            @RequestParam(required = false) String difficulty
    ) {
        List<McqQuestion> list;
        if (track != null && !track.isBlank() && !track.equalsIgnoreCase("all") &&
                difficulty != null && !difficulty.isBlank() && !difficulty.equalsIgnoreCase("all")) {
            list = mcqRepo.findByTrackIgnoreCaseAndDifficultyIgnoreCaseAndActiveTrue(track, difficulty);
        } else if (track != null && !track.isBlank() && !track.equalsIgnoreCase("all")) {
            list = mcqRepo.findByTrackIgnoreCaseAndActiveTrue(track);
        } else if (difficulty != null && !difficulty.isBlank() && !difficulty.equalsIgnoreCase("all")) {
            list = mcqRepo.findByDifficultyIgnoreCaseAndActiveTrue(difficulty);
        } else {
            list = mcqRepo.findByActiveTrue();
        }

        List<McqItemDto> dtoList = list.stream().map(McqItemDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    // Public: Get track metadata with live question count
    @GetMapping("/api/mcqs/tracks")
    public ResponseEntity<List<TrackInfo>> getTracks() {
        List<McqQuestion> allActive = mcqRepo.findByActiveTrue();
        Map<String, Long> counts = allActive.stream()
                .collect(Collectors.groupingBy(q -> q.getTrack().toLowerCase(), Collectors.counting()));

        List<TrackInfo> trackList = List.of(
                new TrackInfo("java", "Java & OOPs", "Coffee", "Core Java, JVM, multithreading, OOP patterns", counts.getOrDefault("java", 0L)),
                new TrackInfo("react", "Frontend & React", "Layout", "React 19 hooks, ES6+ JS, CSS Flex/Grid, TypeScript", counts.getOrDefault("react", 0L)),
                new TrackInfo("python", "Python", "Code2", "Python internals, GIL, generators, data structures", counts.getOrDefault("python", 0L)),
                new TrackInfo("database", "Database & SQL", "Database", "Relational indexing, transactions, ACID, queries", counts.getOrDefault("database", 0L)),
                new TrackInfo("backend", "Backend & Systems", "Server", "REST, microservices, CAP theorem, caching, queues", counts.getOrDefault("backend", 0L)),
                new TrackInfo("aptitude", "Aptitude & Logic", "BrainCircuit", "Speed, time, probability, numerical reasoning", counts.getOrDefault("aptitude", 0L)),
                new TrackInfo("cpp", "C++ & Core", "Cpu", "Pointers, memory management, vtables, STL", counts.getOrDefault("cpp", 0L)),
                new TrackInfo("cloud", "Cloud & DevOps", "Cloud", "Docker, Kubernetes, Git, CI/CD, Serverless", counts.getOrDefault("cloud", 0L))
        );

        return ResponseEntity.ok(trackList);
    }

    // Public: Get single question
    @GetMapping("/api/mcqs/{id}")
    public ResponseEntity<McqItemDto> getQuestionById(@PathVariable Long id) {
        return mcqRepo.findById(id)
                .map(McqItemDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Public: Verify answer
    @PostMapping("/api/mcqs/verify")
    public ResponseEntity<VerifyResponse> verifyAnswer(@RequestBody VerifyRequest request) {
        Optional<McqQuestion> itemOpt = mcqRepo.findById(request.questionId());
        if (itemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        McqQuestion item = itemOpt.get();
        boolean isCorrect = item.getCorrectAnswerIndex() == request.selectedIndex();
        return ResponseEntity.ok(new VerifyResponse(
                isCorrect,
                item.getCorrectAnswerIndex(),
                item.getExplanation()
        ));
    }

    // === ADMIN ENDPOINTS ===

    // Admin: List all questions (including active & inactive)
    @GetMapping("/api/admin/mcqs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<McqItemDto>> getAdminMcqs() {
        List<McqItemDto> all = mcqRepo.findAll().stream()
                .map(McqItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(all);
    }

    // Admin: Add new question
    @PostMapping("/api/admin/mcqs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<McqItemDto> createMcq(@RequestBody CreateMcqRequest req) {
        McqQuestion entity = new McqQuestion(
                req.track().toLowerCase().trim(),
                req.category().trim(),
                req.difficulty().trim(),
                req.question().trim(),
                req.codeSnippet() != null && !req.codeSnippet().isBlank() ? req.codeSnippet().trim() : null,
                req.optionA().trim(),
                req.optionB().trim(),
                req.optionC().trim(),
                req.optionD().trim(),
                req.correctAnswerIndex(),
                req.explanation().trim()
        );

        McqQuestion saved = mcqRepo.save(entity);
        return ResponseEntity.ok(McqItemDto.fromEntity(saved));
    }

    // Admin: Update existing question
    @PutMapping("/api/admin/mcqs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<McqItemDto> updateMcq(@PathVariable Long id, @RequestBody CreateMcqRequest req) {
        Optional<McqQuestion> opt = mcqRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        McqQuestion q = opt.get();
        q.setTrack(req.track().toLowerCase().trim());
        q.setCategory(req.category().trim());
        q.setDifficulty(req.difficulty().trim());
        q.setQuestion(req.question().trim());
        q.setCodeSnippet(req.codeSnippet() != null && !req.codeSnippet().isBlank() ? req.codeSnippet().trim() : null);
        q.setOptionA(req.optionA().trim());
        q.setOptionB(req.optionB().trim());
        q.setOptionC(req.optionC().trim());
        q.setOptionD(req.optionD().trim());
        q.setCorrectAnswerIndex(req.correctAnswerIndex());
        q.setExplanation(req.explanation().trim());
        McqQuestion updated = mcqRepo.save(q);
        return ResponseEntity.ok(McqItemDto.fromEntity(updated));
    }

    // Admin: Delete question
    @DeleteMapping("/api/admin/mcqs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMcq(@PathVariable Long id) {
        if (!mcqRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mcqRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin: Toggle active state
    @PatchMapping("/api/admin/mcqs/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<McqItemDto> toggleMcq(@PathVariable Long id) {
        Optional<McqQuestion> opt = mcqRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        McqQuestion q = opt.get();
        q.setActive(!q.getActive());
        McqQuestion updated = mcqRepo.save(q);
        return ResponseEntity.ok(McqItemDto.fromEntity(updated));
    }
}
