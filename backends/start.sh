#!/bin/bash
echo "Running migrations..."
php artisan migrate --force
echo "Creating personal_access_tokens table..."
php artisan tinker --execute="
if (!Schema::hasTable('personal_access_tokens')) {
    Schema::create('personal_access_tokens', function (\$table) {
        \$table->id();
        \$table->morphs('tokenable');
        \$table->string('name');
        \$table->string('token', 64)->unique();
        \$table->text('abilities')->nullable();
        \$table->timestamp('last_used_at')->nullable();
        \$table->timestamp('expires_at')->nullable();
        \$table->timestamps();
    });
    echo 'Table created';
} else {
    echo 'Table already exists';
}
"
echo "Running seeders..."
php artisan db:seed --force
echo "Starting server..."
php artisan serve --host=0.0.0.0 --port=8080