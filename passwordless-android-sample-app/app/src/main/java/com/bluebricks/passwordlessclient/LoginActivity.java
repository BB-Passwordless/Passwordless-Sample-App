package com.bluebricks.passwordlessclient;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.bluebricks.passwordlessclient_.Connector;
import com.bluebricks.passwordlessclient_.PasswordlessResponse;

import org.json.JSONObject;

import java.util.Objects;

public class LoginActivity extends AppCompatActivity {

    Button btnLogin;
    EditText etUsername;
    LinearLayout llChange;
    Connector connector;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Objects.requireNonNull(getSupportActionBar()).hide();

        btnLogin = findViewById(R.id.btnLogin);
        etUsername = findViewById(R.id.etUsername);
        llChange = findViewById(R.id.llChange);


        connector = new Connector(this);

        try {
            connector.init("home.passwordless.com.au",
                    "https://home.passwordless.com.au",
                    "tURHTLmcYMPYYhHGuBqUCRFa0NJjuXQqkEgOXNomsQRS-wxsQ-");
        } catch (Exception e) {
            e.printStackTrace();
        }

        llChange.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                startActivity(new Intent(LoginActivity.this,RegisterActivity.class));
                finish();

            }
        });

        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {


                if(etUsername.getText().toString().equals(""))
                {
                    Toast.makeText(getBaseContext(),"Enter User Name",Toast.LENGTH_LONG).show();
                }
                else
                {
                    connector.login(etUsername.getText().toString(), new PasswordlessResponse() {
                        @Override
                        public void response(int resultCode, String resultMessage, JSONObject resultJson) {
                            if(resultCode==0)
                            {
                                startActivity(new Intent(LoginActivity.this,SuccessActivity.class));
                                finish();
                            }
                            else
                            {
                                popup(resultMessage);
                            }
                        }
                    });
                }
            }
        });

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);
        connector.onActivityResult(requestCode,resultCode,data);
    }


    public void popup(String message)
    {
        runOnUiThread(()->{
            new AlertDialog.Builder(LoginActivity.this)
                    .setMessage(message)
                    .setCancelable(false)
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            //finish();
                        }
                    })
                    .show();
        });

    }

}