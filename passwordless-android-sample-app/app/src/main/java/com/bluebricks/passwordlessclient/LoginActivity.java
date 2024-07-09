package com.bluebricks.passwordlessclient;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bluebricks.passwordlessclient_.Connector;
import com.bluebricks.passwordlessclient_.PasswordlessResponse;
import com.squareup.picasso.MemoryPolicy;
import com.squareup.picasso.Picasso;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class LoginActivity extends AppCompatActivity {

    Button btnLogin;
    EditText etUsername;
    LinearLayout llChange;
    Connector connector;

    ImageView ivLogo;
    TextView tvAppName;

    boolean isSdkLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Objects.requireNonNull(getSupportActionBar()).hide();

        btnLogin = findViewById(R.id.btnLogin);
        etUsername = findViewById(R.id.etUsername);
        llChange = findViewById(R.id.llChange);

        ivLogo = findViewById(R.id.ivLogo);
        tvAppName = findViewById(R.id.tvAppNAme);


        connector = new Connector(this);


        try
        {
            isSdkLoaded = connector.init("https://api.passwordless4u.com",
                    "https://api.passwordless4u.com/v1",
                    "api.passwordless4u.com",
                    "3G07EdrKB6cACrrkHLJdMqR0y7_XMidCgWFzjY1TdJQKoePg_A"
            );

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
                else  if(!isSdkLoaded)
                {
                    Toast.makeText(getBaseContext(),"load sdk first",Toast.LENGTH_LONG).show();
                }
                else
                {
                    connector.login(etUsername.getText().toString(), new PasswordlessResponse() {
                        @Override
                        public void response(int resultCode, String resultMessage, JSONObject resultJson) {
                            if(resultCode==0)
                            {
                                startActivity(new Intent(LoginActivity.this,SuccessActivity.class).putExtra("from","L"));
                                //finish();
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


        try{
            connector.getApplicationDetails(new PasswordlessResponse() {
                @Override
                public void response(int resultCode, String resultMessage, JSONObject resultData) {
                    if(resultCode==0)
                    {
                        String imageUrl="";
                        String appName="";

                        try {
                            imageUrl= resultData.getString("logo");
                            appName= resultData.getString("name");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }


                        try {
                            String ss= imageUrl.substring(imageUrl.indexOf(",")+1);
                            byte[] decodedString = Base64.decode(ss, Base64.DEFAULT);
                            Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0,decodedString.length);
                            ivLogo.setImageBitmap(decodedByte);
                        }
                        catch (Exception e){
                            Picasso.with(getApplicationContext()).load(imageUrl)
                                    .placeholder(R.drawable.logo)
                                    .error(R.drawable.logo)
                                    .memoryPolicy(MemoryPolicy.NO_CACHE, MemoryPolicy.NO_STORE)
                                    .into(ivLogo);
                        };



                        if(appName!=null)
                            tvAppName.setText(appName+" Login");
                    }
                    else
                    {
                        popup(resultMessage);
                    }
                }
            });
        }catch (Exception e){

        }
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