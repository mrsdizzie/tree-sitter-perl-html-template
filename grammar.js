module.exports = grammar({
  name: 'perl_html_template',

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
      optional('NAME='), optional('"'), $.parameter_name, optional('"'),
      $._close_tag
    ),

    loop: $ => seq(
      $._start_loop,
      optional('NAME='), optional('"'), $.loop_name, optional('"'), '>',
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
      optional('NAME='), optional('"'), $.parameter_name, optional('"'), '>',
      repeat($.template),
      optional(seq($._start_else, repeat($.template))),
      $._close_if
    ),

    unless: $ => seq(
      $._start_unless,
      optional('NAME='), optional('"'), $.parameter_name, optional('"'), '>',
      repeat($.template),
      $._close_unless
    ),

    parameter_name: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    loop_name: $ => $.parameter_name,
    file_name: $ => /[a-zA-Z_][a-zA-Z0-9_]*\.tmpl/,
    content: $ => prec.right(repeat1(choice(/[^<]+|</, '<TMPL'))),

    _start_variable: $ => alias(/<\s*(?:!--\s*)?TMPL_VAR/i, 'TMPL_VAR'),
    _start_loop: $ => alias(/<\s*(?:!--\s*)?TMPL_LOOP/i, 'TMPL_LOOP'),
    _start_include: $ => alias(/<\s*(?:!--\s*)?TMPL_INCLUDE/i, 'TMPL_INCLUDE'),
    _start_if: $ => alias(/<\s*(?:!--\s*)?TMPL_IF/i, 'TMPL_IF'),
    _start_else: $ => alias(/<\s*(?:!--\s*)?TMPL_ELSE/i, 'TMPL_ELSE'),
    _start_unless: $ => alias(/<\s*(?:!--\s*)?TMPL_UNLESS/i, 'TMPL_UNLESS'),
    _close_loop: $ => alias(/<\s*(?:!--)?\s*\/TMPL_LOOP\s*(?:--)?\s*>/i, '/TMPL_LOOP'),
    _close_if: $ => alias(/<\s*(?:!--)?\s*\/TMPL_IF\s*(?:--)?\s*>/i, '/TMPL_IF'),
    _close_unless: $ => alias(/<\s*(?:!--)?\s*\/TMPL_UNLESS\s*(?:--)?\s*>/i, '/TMPL_UNLESS'),
    _close_tag: $ => /\s*(?:--)?\s*>/,
  }
});
