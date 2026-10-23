window.pastedWeeks = [
  {
    "title": "Week 1",
    "description": "Introduction, toplevel, expressions, types, and basic values.",
    "questions": [
      [
        "As introduced in the module's tour of the language, which description best fits OCaml?",
        [
          "Dynamically typed, so you only learn of type mistakes when the code runs.",
          "Statically typed with type inference, so the compiler checks types ahead of time yet you rarely write annotations.",
          "Statically typed, but every binding and parameter must be given an explicit type annotation.",
          "Untyped: values carry no type information at all."
        ],
        "Statically typed with type inference, so the compiler checks types ahead of time yet you rarely write annotations."
      ],
      [
        "The first time you press Run on a lecture page, the toplevel takes a few seconds to respond, but later runs are fast. What best explains this?",
        [
          "The first click registers your machine with a grading server that then caches your results.",
          "The OCaml-to-JavaScript runtime has to load into the page once; after that it is in memory, so further runs are quick.",
          "The browser downloads a fresh copy of your code from the instructor each time you run.",
          "The first run compiles OCaml on a remote server, and the slow step is the network round trip."
        ],
        "The OCaml-to-JavaScript runtime has to load into the page once; after that it is in memory, so further runs are quick."
      ],
      [
        "What does the OCaml toplevel print in response to the following binding?\n\nlet greeting = \"hi\"",
        [
          "greeting = \"hi\"",
          "val greeting : string = \"hi\"",
          "val greeting : \"hi\"",
          "Nothing; string bindings are silent."
        ],
        "val greeting : string = \"hi\""
      ],
      [
        "What is the inferred type of this function?\n\nlet g n = n * 2",
        [
          "int -> int",
          "float -> float",
          "int -> float",
          "OCaml cannot infer this without an annotation"
        ],
        "int -> int"
      ],
      [
        "Which of these expressions has a type unit?",
        [
          "3.14",
          "true",
          "print_string \"go\"",
          "\"unit\""
        ],
        "print_string \"go\""
      ],
      [
        "Consider this OCaml code. Select ALL statements that are true.\n\nlet xs = [1; 2; 3]\nlet ys = 0 :: xs",
        [
          "ys is [0; 1; 2; 3].",
          "xs is still [1; 2; 3] after the second line.",
          "The :: operation modifies xs in place to prepend 0.",
          "The runtime can share the [1; 2; 3] tail between xs and ys rather than copying it."
        ],
        "ys is [0; 1; 2; 3]., xs is still [1; 2; 3] after the second line., The runtime can share the [1; 2; 3] tail between xs and ys rather than copying it."
      ],
      [
        "What does this program print?\n\nlet () = print_endline \"one\"\nlet () = print_endline \"two\"; print_endline \"three\"",
        [
          "one, then two, then three",
          "two, then three, then one",
          "one and three; two is skipped",
          "The program does not compile"
        ],
        "one, then two, then three"
      ],
      [
        "You write `let area s = s * s`, and the toplevel reports `int -> int`. You then evaluate `area 2.0`. What does OCaml do?\n\nlet area s = s * s\nlet _ = area 2.0",
        [
          "Reject it with a type error at compile time.",
          "Implicitly convert 2.0 to 2 and return 4",
          "Return 4.0, lifting * to floats.",
          "Return 2.0, treating * as no-op on floats."
        ],
        "Reject it with a type error at compile time."
      ],
      [
        "Which of the following functions are referentially transparent (a call can be replaced by its return value without changing the meaning of the surrounding program)? Select all that apply.",
        [
          "let f x = x * x",
          "let f x = print_int x; x",
          "let f x = String.length x",
          "let f () = read_line ()"
        ],
        "let f x = x * x, let f x = String.length x"
      ],
      [
        "Select ALL statements that are true, based only on material from Module 1.",
        [
          "In OCaml, = is structural equality (compares by content), whereas == is physical (pointer) equality.",
          "let () = 42 compiles, because the toplevel accepts any expression on the right of a binding.",
          "0.1 +. 0.2 does not evaluate to exactly 0.3, because IEEE 754 floats have finite precision.",
          "In let x = 1 followed by let x = x + 1, the second binding shadows the first; the original value 1 is not mutated and stays alive for any code that captured it.",
          "subleq is not Turing complete, which is why we use higher-level languages instead."
        ],
        "In OCaml, = is structural equality (compares by content), whereas == is physical (pointer) equality., 0.1 +. 0.2 does not evaluate to exactly 0.3, because IEEE 754 floats have finite precision., In let x = 1 followed by let x = x + 1, the second binding shadows the first; the original value 1 is not mutated and stays alive for any code that captured it."
      ]
    ]
  },
  {
    "title": "Week 2",
    "description": "Basic types, operators, let-in expressions, and precedence.",
    "questions": [
      [
        "What is the type of the literal `3.` in OCaml?\n\nlet x = 3.",
        [
          "int",
          "float",
          "string",
          "It is a syntax error: a digit is required after the dot."
        ],
        "float"
      ],
      [
        "What does this expression evaluate to?\n\nlet _ = 17 / 5",
        [
          "float = 3.4",
          "int = 3",
          "int = 4",
          "float = 3.0"
        ],
        "int = 3"
      ],
      [
        "Which operator concatenates two strings in OCaml?\n\nlet _ = \"foo\" ?? \"bar\"",
        [
          "+",
          "^",
          "&&",
          "^."
        ],
        "^"
      ],
      [
        "Which snippet fails to compile?",
        [
          "let _ = 3.5 *. 4.0",
          "let _ = 10.0 *. 3",
          "let _ = 10 * 3",
          "let _ = 10.0 *. float_of_int 3"
        ],
        "let _ = 10.0 *. 3"
      ],
      [
        "After these three top-level bindings, what value does the name `x` refer to?\n\nlet x = 1\nlet x = x + 1\nlet x = x * 10",
        [
          "1",
          "2",
          "20",
          "11"
        ],
        "20"
      ],
      [
        "What does OCaml require the then-branch to have for this if (with no else) to compile?\n\nlet _ = if 5 > 2 then print_string \"hi\"",
        [
          "Any type at all; an if with no else accepts anything.",
          "Type bool, to match the condition.",
          "Type unit, because a missing else is treated as else ().",
          "It can never compile: every if needs an else."
        ],
        "Type unit, because a missing else is treated as else ()."
      ],
      [
        "What type does OCaml infer for this function?\n\nlet greet name = \"Hello, \" ^ name",
        [
          "string -> string",
          "string -> string -> string",
          "'a -> string",
          "string -> unit"
        ],
        "string -> string"
      ],
      [
        "Select all statements that are true.",
        [
          "&& and || short-circuit: || evaluates its right operand only when the left is false.",
          "= tests structural (contents) equality, while == tests physical (same-object-in-memory) equality.",
          "0 is treated as a falsy value, so if 0 then ... else ... is accepted.",
          "Function application binds tighter than any infix operator, so succ 5 + 3 parses as (succ 5) + 3.",
          "\"value: \" ^ 5 compiles because OCaml coerces the int 5 to a string."
        ],
        "&& and || short-circuit: || evaluates its right operand only when the left is false., = tests structural (contents) equality, while == tests physical (same-object-in-memory) equality., Function application binds tighter than any infix operator, so succ 5 + 3 parses as (succ 5) + 3."
      ],
      [
        "What does this nested expression evaluate to?\n\nlet _ =\n  let a = 3 in\n  let b = a * a in\n  let a = 100 in\n  a + b",
        [
          "200",
          "18",
          "109",
          "106"
        ],
        "109"
      ],
      [
        "Consider the expression below. Select all true statements about it.\n\nlet _ = 10 - 2 * 3 > 0 || 1 = 2 && false",
        [
          "It type-checks and has type bool.",
          "Using OCaml's precedence, it parses as (((10 - (2 * 3)) > 0) || ((1 = 2) && false)).",
          "It evaluates to true.",
          "It evaluates to false.",
          "It is a type error because > compares an int to a bool."
        ],
        "It type-checks and has type bool., Using OCaml's precedence, it parses as (((10 - (2 * 3)) > 0) || ((1 = 2) && false))., It evaluates to true."
      ]
    ]
  },
  {
    "title": "Week 3",
    "description": "Functions, closures, recursion, and partial application.",
    "questions": []
  },
  {
    "title": "Week 4",
    "description": "Tuples, lists, records, and algebraic data types.",
    "questions": [
      [
        "What is the type of this value?\n\nlet v = (3, \"hi\", true)",
        [
          "int * string * bool list",
          "(int, string, bool)",
          "int * string * bool",
          "int list"
        ],
        "int * string * bool"
      ],
      [
        "Given `let p = (10, 20)`, what does `snd p` evaluate to?\n\nlet p = (10, 20)\nlet result = snd p",
        [
          "10",
          "20",
          "(10,20)",
          "A type error: snd does not exist."
        ],
        "20"
      ],
      [
        "What is the type of names?\n\nlet names = [\"ann\"; \"bo\"; \"cy\"]",
        [
          "string list",
          "(string * string * string)",
          "string * string * string",
          "A syntax error: lists may not hold strings."
        ],
        "string list"
      ],
      [
        "Given the record type and value below, what does `r.y` evaluate to?\n\ntype point = { x : float; y : float }\nlet r = { x = 3.0; y = 4.0 }\nlet result = r.y",
        [
          "3",
          "4",
          "(3.,4.)",
          "A type error: fields are accessed by position, not name."
        ],
        "4"
      ],
      [
        "Given the record below, what does `{ base with price = 99 }` evaluate to?\n\ntype item = { name : string; price : int; qty : int }\nlet base = { name = \"pen\"; price = 50; qty = 3 }\nlet result = { base with price = 99 }",
        [
          "{ name = \"pen\"; price = 50; qty = 3 }, and afterwards base.price is 99",
          "{ name = \"pen\"; price = 99; qty = 3 }",
          "{ name = \"\"; price = 99; qty = 0 }",
          "A type error."
        ],
        "{ name = \"pen\"; price = 99; qty = 3 }"
      ],
      [
        "Given the variant below, which one expression is a valid value of type move?\n\ntype move =\n  | Up of int\n  | Down of int\n  | Step of int * int",
        [
          "Up \"3\"",
          "Step 2 5",
          "Step (2, 5)",
          "Left 4"
        ],
        "Step (2, 5)"
      ],
      [
        "What type does the OCaml toplevel report for `xs`?\n\nlet xs = []",
        [
          "unit",
          "int list",
          "'a list",
          "[]"
        ],
        "'a list"
      ],
      [
        "Given the function below, select all true statements.\n\nlet dup (a, b) = (a, b, a)",
        [
          "Its type is 'a * 'b -> 'a * 'b * 'a.",
          "Its type is 'a -> 'b -> 'a * 'b * 'a.",
          "It takes a single argument (a pair) and returns a triple.",
          "It is a curried function of two arguments.",
          "dup (7, \"ok\") evaluates to (7, \"ok\", 7)."
        ],
        "Its type is 'a * 'b -> 'a * 'b * 'a., It takes a single argument (a pair) and returns a triple., dup (7, \"ok\") evaluates to (7, \"ok\", 7)."
      ],
      [
        "Given the recursive variant below, select every expression that is a valid value of type `tree`.\n\ntype tree =\n  | Leaf of int\n  | Node of tree * tree",
        [
          "Leaf 7",
          "Node (Leaf 1, Leaf 2)",
          "Node (1, 2)",
          "Node (Node (Leaf 1, Leaf 2), Leaf 3)",
          "Node Leaf 1 Leaf 2"
        ],
        "Leaf 7, Node (Leaf 1, Leaf 2), Node (Node (Leaf 1, Leaf 2), Leaf 3)"
      ],
      [
        "Consider this file-system model. What is the inferred type of `home`?\n\ntype perms = { read : bool; write : bool; exec : bool }\n\ntype entry =\n  | File of { name : string; size : int; perms : perms }\n  | Dir of { name : string; perms : perms; contents : entry list }\n\nlet rx = { read = true; write = false; exec = true }\nlet cat = File { name = \"cat.jpg\"; size = 184_000; perms = rx }\nlet home = Dir { name = \"home\"; perms = rx; contents = [cat] }",
        [
          "Dir",
          "entry",
          "entry list",
          "File * Dir"
        ],
        "entry"
      ]
    ]
  },
  {
    "title": "Week 5",
    "description": "Pattern matching, variants, exhaustiveness, and guards.",
    "questions": [
      [
        "What does this evaluate to?\n\nlet classify n =\n  match n with\n  | 0 -> \"zero\"\n  | 1 -> \"one\"\n  | _ -> \"many\"\n\nlet result = classify 5",
        [
          "\"zero\"",
          "\"one\"",
          "\"many\"",
          "Match_failure"
        ],
        "\"many\""
      ],
      [
        "What does `grade s` evaluate to, and what does the compiler say?\n\nlet grade s =\n  match s with\n  | total -> \"score: \" ^ string_of_int total\n  | 100 -> \"perfect\"\n\nlet result = grade 100",
        [
          "\"perfect\", no warning",
          "\"score: 100\", with a warning that the second case is unused",
          "Compile error: non-exhaustive",
          "Match_failure at runtime"
        ],
        "\"score: 100\", with a warning that the second case is unused"
      ],
      [
        "Which statement about `_` and a variable name like `_x` is correct?",
        [
          "Both can be referenced on the right-hand side.",
          "Neither can be referenced on the right-hand side.",
          "_ binds nothing and cannot be referenced; _x is a binding and can be used on the right-hand side.",
          "_ and _x are identical in every respect."
        ],
        "_ binds nothing and cannot be referenced; _x is a binding and can be used on the right-hand side."
      ],
      [
        "What does `sum_all [4; 5; 6]` return?\n\nlet rec sum_all l =\n  match l with\n  | [] -> 0\n  | h :: t -> h + sum_all t",
        [
          "0",
          "3",
          "15",
          "An exception is raised."
        ],
        "15"
      ],
      [
        "What does `is_vowel 'e'` return?\n\nlet is_vowel = function\n  | 'a' | 'e' | 'i' | 'o' | 'u' -> true\n  | _ -> false",
        [
          "true",
          "false",
          "Compile error: or-patterns are not allowed in function",
          "Match_failure"
        ],
        "true"
      ],
      [
        "What does `band 5` return?\n\nlet band = function\n  | n when n >= 10 -> \"high\"\n  | _ -> \"low\"",
        [
          "\"high\"",
          "\"low\"",
          "Compile error",
          "Match_failure"
        ],
        "\"low\""
      ],
      [
        "Consider this match on a variant. What does the compiler report?\n\ntype traffic_light = Red | Yellow | Green\n\nlet action = function\n  | Red -> \"stop\"\n  | Green -> \"go\"",
        [
          "Nothing; the match is exhaustive.",
          "Warning 8 (partial-match): a case is not matched, namely Yellow",
          "Warning 11 (redundant-case).",
          "A type error"
        ],
        "Warning 8 (partial-match): a case is not matched, namely Yellow"
      ],
      [
        "Select ALL statements that are true about pattern matching as covered in this module.",
        [
          "Switching the order of cases may change the behaviour of a match, because the first pattern that matches wins",
          "It is a compiler error if a match is not exhaustive.",
          "A non-exhaustive match that is reached on an uncovered value raises Match_failure at runtime.",
          "A when guard suppresses exhaustiveness checking for that clause, because the compiler cannot reason about arbitrary boolean expressions.",
          "Two alternatives of an or-pattern may bind different sets of variables as long as the right-hand side uses only one of them."
        ],
        "Switching the order of cases may change the behaviour of a match, because the first pattern that matches wins, A non-exhaustive match that is reached on an uncovered value raises Match_failure at runtime., A when guard suppresses exhaustiveness checking for that clause, because the compiler cannot reason about arbitrary boolean expressions."
      ],
      [
        "The compiler rejects this with an error. Why?\n\ntype packet = | Count of int | Flag of bool\n\nlet payload = function\n  | Count v | Flag v -> v",
        [
          "Or-patterns are not allowed inside function.",
          "The two names v clash with each other.",
          "The two v bindings have incompatible types: int from Count, bool from Flag",
          "Count and Flag cannot appear in the same clause."
        ],
        "The two v bindings have incompatible types: int from Count, bool from Flag"
      ],
      [
        "Select ALL statements that are true about this clause:\n\n| And (e1, e2) ->\n    (match eval env e1, eval env e2 with\n     | Some (VBool p), Some (VBool q) -> Some (VBool (p && q))\n     | _ -> None)",
        [
          "The pattern Some (VBool p), Some (VBool q) is a nested pattern: a tuple of two option patterns, each wrapping a VBool pattern that binds a boolean.",
          "eval [] (And (Int 0, Bool true)) returns None, because the first sub-result is Some (VInt 0), which does not match Some (VBool p), so the pair falls through to _ -> None.",
          "The parentheses around the inner match are optional; removing them does not change how the clauses parse.",
          "Matching on the pair (eval env e1, eval env e2) lets one clause name both expected shapes and one wildcard collapse every off-shape combination, instead of nesting two separate matches.",
          "Because eval returns value option, the inner pair-match here is non-exhaustive and triggers warning 8."
        ],
        "The pattern Some (VBool p), Some (VBool q) is a nested pattern: a tuple of two option patterns, each wrapping a VBool pattern that binds a boolean., eval [] (And (Int 0, Bool true)) returns None, because the first sub-result is Some (VInt 0), which does not match Some (VBool p), so the pair falls through to _ -> None., Matching on the pair (eval env e1, eval env e2) lets one clause name both expected shapes and one wildcard collapse every off-shape combination, instead of nesting two separate matches."
      ]
    ]
  },
  {
    "title": "Week 6",
    "description": "Higher-order functions, List module, map, filter, and fold.",
    "questions": [
      [
        "What is the type of `List.map`?",
        [
          "('a -> bool) -> 'a list -> 'a list",
          "('a -> 'b) -> 'a list -> 'b list",
          "('a -> 'b -> 'a) -> 'a -> 'b list -> 'a",
          "'a list -> 'b list"
        ],
        "('a -> 'b) -> 'a list -> 'b list"
      ],
      [
        "What does this expression evaluate to?\n\nList.map (fun x -> x * x) [1; 2; 3; 4]",
        [
          "[1; 2; 3; 4]",
          "[1; 4; 9; 16]",
          "30",
          "[2; 4; 6; 8]"
        ],
        "[1; 4; 9; 16]"
      ],
      [
        "What does this expression evaluate to?\n\nList.filter (fun x -> x > 3) [5; 1; 7; 2; 9; 3; 4]",
        [
          "[5; 7; 9; 4]",
          "[1; 2; 3]",
          "[4; 9; 7; 5]",
          "[true; false; true; false; true; false; true]"
        ],
        "[5; 7; 9; 4]"
      ],
      [
        "What does this expression evaluate to?\n\nList.fold_left ( * ) 1 [2; 3; 4]",
        [
          "9",
          "0",
          "24",
          "10"
        ],
        "24"
      ],
      [
        "The pipeline operator is defined as `let ( |> ) x f = f x`. What does this evaluate to?\n\n[2; 4; 6] |> List.filter (fun x -> x > 3)",
        [
          "[2]",
          "[4; 6]",
          "[2; 4; 6]",
          "An error: |> does not accept a list on the left."
        ],
        "[4; 6]"
      ],
      [
        "fold_right and fold_left differ in their combining function's argument order. What is the type of `List.fold_left`?",
        [
          "('a -> 'acc -> 'acc) -> 'a list -> 'acc -> 'acc",
          "('acc -> 'a -> 'acc) -> 'acc -> 'a list -> 'acc",
          "('a -> 'b) -> 'a list -> 'b list",
          "('a -> bool) -> 'a list -> 'a list"
        ],
        "('acc -> 'a -> 'acc) -> 'acc -> 'a list -> 'acc"
      ],
      [
        "What does this expression evaluate to?\n\nList.fold_left (fun acc x -> acc ^ x) \"\" [\"a\"; \"b\"; \"c\"]",
        [
          "\"abc\"",
          "\"cba\"",
          "\"a\"",
          "An error: ^ is not a valid accumulator function."
        ],
        "\"abc\""
      ],
      [
        "Select ALL expressions equivalent to `List.map f xs` (for any function `f` and list `xs`).",
        [
          "List.fold_right (fun x acc -> f x :: acc) xs []",
          "List.filter f xs",
          "List.filter_map (fun x -> Some (f x)) xs",
          "List.rev (List.fold_left (fun acc x -> f x :: acc) [] xs)",
          "List.fold_left (fun acc x -> f x :: acc) [] xs"
        ],
        "List.fold_right (fun x acc -> f x :: acc) xs [], List.filter_map (fun x -> Some (f x)) xs, List.rev (List.fold_left (fun acc x -> f x :: acc) [] xs)"
      ],
      [
        "Select ALL true statements about map, filter, and fold (as developed in M06).",
        [
          "map can be implemented using fold_right, e.g. List.fold_right (fun x acc -> f x :: acc) xs [].",
          "filter can be implemented using fold_right",
          "fold_left can be implemented using map.",
          "List.fold_right is not tail-recursive, while List.fold_left is.",
          "List.map f xs can return a list shorter than xs."
        ],
        "map can be implemented using fold_right, e.g. List.fold_right (fun x acc -> f x :: acc) xs []., filter can be implemented using fold_right, List.fold_right is not tail-recursive, while List.fold_left is."
      ],
      [
        "Recall `let compose f g = fun x -> f (g x)` and the left-associative trace of `fold_left`. What is `result`?\n\nlet compose f g = fun x -> f (g x)\nlet pipe = compose (List.filter (fun x -> x > 5)) (List.map (fun x -> x * x))\nlet result = List.fold_left (-) 0 (pipe [1; 2; 3; 4])",
        [
          "30",
          "-30",
          "-25",
          "0"
        ],
        "-25"
      ]
    ]
  },
  {
    "title": "Week 7",
    "description": "Mutable state, exceptions, lazy evaluation, and modules.",
    "questions": []
  }
];
