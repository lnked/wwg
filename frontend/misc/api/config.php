<?php

return [
    'fields' => [
        'lang'  => [ 'lang' => 'Язык', 'require' => false ],
        'name'  => [ 'title' => 'Имя', 'require' => true ],
        'phone'  => [ 'title' => 'Телефон', 'require' => false ],
        'email'  => [ 'title' => 'Электронная почта', 'require' => true ],
        'message'  => [ 'title' => 'Сообщение', 'require' => false ],
        'question'  => [ 'title' => 'Вопрос', 'require' => false ]
    ],

    'subject' => 'Новое сообщение с сайта',

    'message' => [
        'ru' => [
            'title' => 'Отправка заявки',
            'success' => 'Заявка отправлена!',
            'failure' => 'Заявка не отправлена, произошла ошибка!',
            'empty' => 'Заполните поле',
            'empty_correct' => 'Заполните поле, корректно',
        ],
        'en' => [
            'title' => 'Submitting an application',
            'success' => 'Application sent!',
            'failure' => 'The application is not sent, an error occurred!',
            'empty' => 'Fill in the',
            'empty_correct' => 'Fill in the field correctly',
        ]
    ],

    'send_email' => 'noreply@wwgamescorp.ru',
    'send_password' => 'f9DRWGQj',
    'send_host' => 'smtp.timeweb.ru',

    'emails' => [
        'info@newtime.biz',
        'ak@wwgamescorp.ru',
        'ed.proff@gmail.com'
    ]
];
