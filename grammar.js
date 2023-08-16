module.exports = grammar({
  name: 'html_template',

  extras: $ => [
    /\s/,
  ],

  rules: {
    template: $ => prec(1, repeat1(choice(
      $.variable,
      $.loop,
      $.include,
      $.if,
      $.unless,
      $.content
    ))),

    variable: $ => seq(
      $._start_variable,
      'NAME=', optional('"'), $.parameter_name, optional('"'), 
      $._close_tag
    ),

    loop: $ => seq(
      $._start_loop,
      'NAME=', optional('"'), $.loop_name, optional('"'), '>',
      repeat($.template),
      $._close_loop
    ),

    include: $ => seq(
      $._start_include,
      'NAME=', optional('"'), $.file_name, optional('"'), 
      $._close_tag
    ),

    if: $ => seq(
      $._start_if,
      'NAME=', optional('"'), $.parameter_name, optional('"'), '>',
      repeat($.template),
      optional(seq('<TMPL_ELSE>', repeat($.template))),
      $._close_if
    ),

    unless: $ => seq(
      $._start_unless,
      'NAME=', optional('"'), $.parameter_name, optional('"'), '>',
      repeat($.template),
      $._close_unless
    ),

    parameter_name: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    loop_name: $ => $.parameter_name,
    file_name: $ => /[a-zA-Z_][a-zA-Z0-9_]*\.tmpl/,
    content: $ => prec.right(repeat1(choice(/[^<]+|</, '<TMPL'))),

    _start_variable: $ => /<\s*(?:!--\s*)?TMPL_VAR/i,
    _start_loop: $ => /<\s*(?:!--\s*)?TMPL_LOOP/i,
    _start_include: $ => /<\s*(?:!--\s*)?TMPL_INCLUDE/i,
    _start_if: $ => /<\s*(?:!--\s*)?TMPL_IF/i,
    _start_unless: $ => /<\s*(?:!--\s*)?TMPL_UNLESS/i,
    _close_tag: $ => /\s*(?:--)?\s*>/,
    _close_loop: $ => /<\s*(?:!--)?\s*\/TMPL_LOOP\s*(?:--)?\s*>/i,
    _close_if: $ => /<\s*(?:!--)?\s*\/TMPL_IF\s*(?:--)?\s*>/i,
    _close_unless: $ => /<\s*(?:!--)?\s*\/TMPL_UNLESS\s*(?:--)?\s*>/i,
  }
});
