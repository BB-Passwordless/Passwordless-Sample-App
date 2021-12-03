package com.bluebricks.passwordlessclient;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.bluebricks.passwordlessclient_.Connector;
import com.bluebricks.passwordlessclient_.PasswordlessResponse;

import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;

public class RegisterActivity extends AppCompatActivity {

    Button btnRegister;
    EditText etUsername;
    LinearLayout llChange;
    Connector connector;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        Objects.requireNonNull(getSupportActionBar()).hide();

        btnRegister = findViewById(R.id.btnRegister);
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

        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(etUsername.getText().toString().equals(""))
                {
                    Toast.makeText(getBaseContext(),"Enter User Name",Toast.LENGTH_LONG).show();
                }
                else
                {
                    connector.register(etUsername.getText().toString(), new PasswordlessResponse() {
                        @Override
                        public void response(int resultCode, String resultMessage, JSONObject resultJson)
                        {
                            if(resultCode==0)
                            {
                                startActivity(new Intent(RegisterActivity.this,SuccessActivity.class));
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

        llChange.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                startActivity(new Intent(RegisterActivity.this,LoginActivity.class));
                finish();
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
            new AlertDialog.Builder(RegisterActivity.this)
                    .setMessage(message)
                    .setCancelable(false)
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                          // finish();
                        }
                    })
                    .show();
        });

    }

}