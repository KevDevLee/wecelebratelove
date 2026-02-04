<?php
declare(strict_types=1);

$recipient = 'info@wecelebratelove.de';
$subject = 'Neue Anfrage über das Kontaktformular';
$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $honeypot = trim($_POST['website'] ?? '');
    if ($honeypot !== '') {
        http_response_code(204);
        exit;
    }

    $firstName = trim((string)($_POST['firstName'] ?? ''));
    $lastName = trim((string)($_POST['lastName'] ?? ''));
    $email = trim((string)($_POST['email'] ?? ''));
    $phone = trim((string)($_POST['phone'] ?? ''));
    $weddingDate = trim((string)($_POST['weddingDate'] ?? ''));
    $message = trim((string)($_POST['message'] ?? ''));
    $privacy = $_POST['privacy'] ?? null;

    if ($firstName === '') {
        $errors[] = 'Bitte gib deinen Vornamen an.';
    }
    if ($lastName === '') {
        $errors[] = 'Bitte gib deinen Nachnamen an.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Bitte gib eine gültige E-Mail-Adresse an.';
    }
    if ($message === '') {
        $errors[] = 'Bitte schreibe mir kurz, wie ich dir helfen kann.';
    }
    if ($privacy === null) {
        $errors[] = 'Bitte stimme der Datenschutzerklärung zu.';
    }

    if (!$errors) {
        $bodyLines = [
            'Neue Anfrage über das Kontaktformular der Website:',
            '',
            "Vorname: {$firstName}",
            "Nachname: {$lastName}",
            "E-Mail: {$email}",
            "Telefon: " . ($phone !== '' ? $phone : 'nicht angegeben'),
            "Geplanter Trauungstermin: " . ($weddingDate !== '' ? $weddingDate : 'nicht angegeben'),
            '',
            'Nachricht:',
            $message,
            '',
            '---',
            'Diese Nachricht wurde automatisch von der Website wecelebratelove.de versendet.'
        ];
        $body = implode(PHP_EOL, $bodyLines);

        $headers = [];
        $headers[] = 'From: We Celebrate Love <info@wecelebratelove.de>';
        $headers[] = 'Reply-To: ' . $email;
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';

        $success = mail($recipient, $subject, $body, implode("\r\n", $headers));
        if (!$success) {
            $errors[] = 'Leider konnte deine Anfrage gerade nicht gesendet werden. Bitte versuche es später erneut oder schicke mir eine E-Mail.';
        }
    }
} else {
    header('Location: /', true, 302);
    exit;
}

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$pageTitle = $success ? 'Vielen Dank' : 'Fehler beim Versand';
$messageTitle = $success ? 'Deine Nachricht wurde übermittelt' : 'Etwas ist schiefgelaufen';
$messageText = $success
    ? 'Vielen Dank für deine Nachricht. Ich melde mich so schnell wie möglich bei dir.'
    : 'Bitte überprüfe deine Eingaben oder versuche es später noch einmal.';

?>
<!DOCTYPE html>
<html class="loaded" lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?= escape($pageTitle); ?> | We Celebrate Love</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400&family=Rubik:wght@500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/index.css" />
    <link rel="stylesheet" href="css/sections.css" />
  </head>
  <body>
    <div class="stack backgrounds">
      <main class="wrapper stack gap-8 items-center justify-center min-h-[60vh] legal-page">
        <div class="text-center stack gap-4 max-w-xl bg-white/80 rounded-3xl p-10 shadow-lg border border-gray-100">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">
            Kontakt
          </p>
          <h1 class="text-4xl font-light text-slate-800 font-serif">
            <?= escape($messageTitle); ?>
          </h1>
          <p class="text-slate-600 leading-relaxed">
            <?= escape($messageText); ?>
          </p>
          <?php if ($errors): ?>
            <ul class="text-left text-sm text-red-600 space-y-1">
              <?php foreach ($errors as $error): ?>
                <li>• <?= escape($error); ?></li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a class="btn-brown text-white font-medium py-3 px-6 rounded-lg" href="/">
              Zurück zur Startseite
            </a>
            <a class="text-amber-500 font-medium py-3 px-6" href="/#contact">
              Zurück zum Formular
            </a>
          </div>
        </div>
      </main>
    </div>
  </body>
</html>
