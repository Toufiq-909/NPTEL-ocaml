window.pastedWeeks[6] = {
  title: 'Week 7',
  description: 'Mutable state, exceptions, lazy evaluation, and modules.',
  questions: [
    ['What is the type of ref true?',
      ['bool', 'bool ref', "'a ref", 'unit'],
      'bool ref'],

    ['What does the final read evaluate to?\n\nlet r = ref 3\nlet () = r := !r * 4\nlet () = decr r\nlet _ = !r',
      ['3', '12', '11', '5'],
      '11'],

    ['What does this expression evaluate to?\n\nlet a = [|10; 20; 30|] in\na.(2) <- 5;\na.(0) + a.(1) + a.(2)',
      ['60', '35', '15', 'Invalid_argument'],
      '35'],

    ['What is the type of the exception value Not_found?',
      ['unit', 'exn', "'a", 'Not_found'],
      'exn'],

    ['What does this expression evaluate to?\n\ntry\n  let _ = 10 / 0 in\n  "computed"\nwith\n  | Not_found -> "not found"\n  | Division_by_zero -> "div by zero"',
      ['"computed"', '"not found"', '"div by zero"', 'runtime crash'],
      '"div by zero"'],

    ['Given:\n\nlet v = lazy (print_endline "hi"; 42)\nlet a = Lazy.force v\nlet b = Lazy.force v\n\nHow many times is "hi" printed?',
      ['0', '1', '2', '3'],
      '1'],

    ['Given this module:\n\nmodule M = struct\n  type t = int\n  let base = 10\n  let double x = x * 2\nend\n\nWhat is the value of M.double * M.base?',
      ['10', '20', '12', 'error'],
      'error'],

    ['Given:\n\nlet x = ref 1\nlet y = ref 1\nlet z = x\nlet () = z := 9\n\nSelect all statements that are true.',
      ['x == z is true', '!y = 1 is true', 'x == y is true', '!x = !z is true', 'x = y is true'],
      'x == z is true, !y = 1 is true, !x = !z is true'],

    ['Consider this module sealed by a signature:\n\nmodule type COUNTER = sig\n  val tick : unit -> int\nend\n\nmodule C : COUNTER = struct\n  let n = ref 0\n  let tick () = incr n; !n\n  let reset () = n := 0\nend\n\nSelect all statements that are true.',
      [
        'C.tick is accessible from outside and has type unit -> int',
        'C.reset is accessible from outside',
        'C.n is accessible from outside',
        'Calling C.reset () from outside is a compile-time Unbound value error',
        'The signature lets you later replace the ref-based implementation without breaking callers'
      ],
      'C.tick is accessible from outside and has type unit -> int, Calling C.reset () from outside is a compile-time Unbound value error, The signature lets you later replace the ref-based implementation without breaking callers'],

    ['The functor SetLite keeps the list sorted ascending with no duplicates.\n\nlet s =\n  Int_set.add 5 (Int_set.add 8 (Int_set.add 5 (Int_set.add 2 Int_set.empty)))\n\nWhat does s hold, and what does Int_set.mem 5 s return?',
      ['[2; 8; 5; 5] and true', '[2; 5; 8] and true', '[2; 5; 5; 8] and true', '[5; 8; 2] and false'],
      '[2; 5; 8] and true']
  ]
};
